param([Parameter(Mandatory=$true)][string]$JobsPath)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$renderData=Get-Content -LiteralPath $JobsPath -Raw | ConvertFrom-Json
$privateFonts=[Drawing.Text.PrivateFontCollection]::new()
$privateFonts.AddFontFile([string]$renderData.fontFile)
$family=@($privateFonts.Families | Where-Object Name -eq 'Outfit')[0]
if(!$family){throw 'Bundled Outfit font was not loaded.'}
$fonts=@{}
$brushes=@{}
$format=[Drawing.StringFormat]::new()
$format.Alignment=[Drawing.StringAlignment]::Center
$format.LineAlignment=[Drawing.StringAlignment]::Near
$count=0
foreach($job in $renderData.jobs){
 $bitmap=[Drawing.Bitmap]::new([int]$job.width,[int]$job.height,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
 $g=[Drawing.Graphics]::FromImage($bitmap)
 try{
  $g.Clear([Drawing.Color]::White)
  $g.TextRenderingHint=[Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::None
  foreach($circle in $job.circles){
   $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
   $fill=[Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml('#9f2458'))
   $pen=[Drawing.Pen]::new([Drawing.ColorTranslator]::FromHtml('#62203e'),2)
   $g.FillEllipse($fill,[single]$circle.x,[single]$circle.y,[single]$circle.size,[single]$circle.size)
   $g.DrawEllipse($pen,[single]$circle.x,[single]$circle.y,[single]$circle.size,[single]$circle.size)
   $fill.Dispose();$pen.Dispose()
   $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::None
  }
  foreach($text in $job.texts){
   $fontKey="$($text.size)-$($text.bold)"
   if(!$fonts.ContainsKey($fontKey)){$style=if($text.bold){[Drawing.FontStyle]::Bold}else{[Drawing.FontStyle]::Regular};$fonts[$fontKey]=[Drawing.Font]::new($family,[single]$text.size,$style,[Drawing.GraphicsUnit]::Pixel)}
   $font=$fonts[$fontKey]
   if(!$brushes.ContainsKey([string]$text.color)){$brushes[[string]$text.color]=[Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml([string]$text.color))}
   $measure=$g.MeasureString([string]$text.value,$font)
   if($measure.Width -gt $text.width){throw "Title exceeds available width: $($job.title)"}
   $area=[Drawing.RectangleF]::new([single]$text.x,[single]$text.y,[single]$text.width,([single]$text.size+8))
   $g.DrawString([string]$text.value,$font,$brushes[[string]$text.color],$area,$format)
  }
  $g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $g.PixelOffsetMode=[Drawing.Drawing2D.PixelOffsetMode]::Half
  for($panel=0;$panel -lt $job.panels.Count;$panel++){
   $panelX=if($job.panelXs){[int]$job.panelXs[$panel]}else{12+$panel*264}
   $bytes=[Convert]::FromBase64String(([string]$job.panels[$panel]).Split(',')[1])
   $stream=[IO.MemoryStream]::new($bytes)
   $source=[Drawing.Image]::FromStream($stream)
   try{
    $target=[Drawing.Rectangle]::new([int]$panelX,[int]$job.boardY,240,([int]$job.boardRows*24))
    $g.DrawImage($source,$target,0,0,80,([int]$job.boardRows*8),[Drawing.GraphicsUnit]::Pixel)
    foreach($sample in @(@(0,0),@(79,0),@(0,($source.Height-1)),@(79,($source.Height-1)),@(17,([Math]::Min(127,$source.Height-1))),@(43,([Math]::Min(132,$source.Height-1))))){
     $expected=([Drawing.Bitmap]$source).GetPixel($sample[0],$sample[1])
     $actual=$bitmap.GetPixel(($panelX+$sample[0]*3+1),($job.boardY+$sample[1]*3+1))
     if($expected.ToArgb() -ne $actual.ToArgb()){throw "Board pixels changed in $($job.name)"}
    }
   }finally{$source.Dispose();$stream.Dispose()}
  }
  $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $outerPivotPen=[Drawing.Pen]::new([Drawing.Color]::White,4)
  $innerPivotPen=[Drawing.Pen]::new([Drawing.ColorTranslator]::FromHtml('#243257'),1.5)
  foreach($pivot in $job.pivots){
   $g.DrawEllipse($outerPivotPen,([single]$pivot.x-6),([single]$pivot.y-6),12,12)
   $g.DrawEllipse($innerPivotPen,([single]$pivot.x-6),([single]$pivot.y-6),12,12)
  }
  $outerPivotPen.Dispose();$innerPivotPen.Dispose()
  $destination=Join-Path ([string]$renderData.output) ('png/'+$job.name+'.png')
  $bitmap.Save($destination,[Drawing.Imaging.ImageFormat]::Png)
 }finally{$g.Dispose();$bitmap.Dispose()}
 $count++
}
foreach($font in $fonts.Values){$font.Dispose()};foreach($brush in $brushes.Values){$brush.Dispose()};$format.Dispose();$privateFonts.Dispose()
Write-Output "Rendered $count PNG images with bundled Outfit and exact ROM board pixels."


