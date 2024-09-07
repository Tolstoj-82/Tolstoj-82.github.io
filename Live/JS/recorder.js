function toggleRecording() {
    isRecording = !isRecording;

    if (isRecording) {
        recordingFrameNumber = 1; // Start the recording frame counter at 1
        recordButton.textContent = 'Stop Recording';
        recordingData = [];
        frameStart = recordingFrameNumber;
    } else {
        recordButton.textContent = 'Start Recording';
        saveRecording(); // Final save when stopping
        cleanUpRecording(); // Clean up the recording after saving
    }
}

// Function to normalize and flatten comma-separated content
function normalizeContent(input) {
    // Remove all whitespace and split by commas
    const flattened = input.replace(/\s+/g, '').split(',');
    return flattened.join('');
}

// Function to compress the normalized content
function compressContent(content) {
    let compressed = '';
    let lastChar = '';
    let count = 0;

    for (const char of content) {
        if (char === lastChar) {
            count++;
        } else {
            if (lastChar) {
                compressed += (count > 1 ? `${lastChar}(${count}),` : `${lastChar},`);
            }
            lastChar = char;
            count = 1;
        }
    }

    if (lastChar) {
        compressed += (count > 1 ? `${lastChar}(${count}),` : `${lastChar},`);
    }

    // Remove trailing comma if there is one
    if (compressed.endsWith(',')) {
        compressed = compressed.slice(0, -1);
    }

    return compressed;
}

function saveRecording() {
    let recordingText = '';

    if (recordingData.length > 0) {
        // Handle the first frame separately
        const firstEntry = recordingData[0];
        const firstCompressedContent = compressContent(normalizeContent(firstEntry.content));
        recordingText += `{frames#1..#${firstEntry.end}}\n[${firstCompressedContent}]`;

        // Handle subsequent frames
        for (let i = 1; i < recordingData.length; i++) {
            const { start, end, content } = recordingData[i];
            const compressedContent = compressContent(normalizeContent(content));
            recordingText += `\n\n{frames#${recordingData[i - 1].end + 1}..#${end}}\n[${compressedContent}]`;
        }
    }

    // Update the textarea with the compressed content

    recordingTextArea.value = recordingText;
    document.getElementById("recordingFrame").innerHTML = "Frame Nr: " + recordingFrameNumber;
}

function cleanUpRecording() {
    const textarea = document.getElementById('recording');
    if (!textarea) {
        console.error('Textarea with ID "recording" not found.');
        return;
    }

    let recordingText = textarea.value;
    const blocks = recordingText.split('\n\n').filter(block => block.trim() !== '');

    let startIndex = 0;
    let endIndex = blocks.length - 1;
    let sub = 0;
    let hasRemovedBlocks = false;

    // Check and remove unnecessary frames from the beginning
    if (blocks[startIndex].includes('[0(180)]')) {
        const match = blocks[startIndex].match(/\{frames?#(\d+)(..#(\d+))?\}/);
        if (match) {
            sub = parseInt(match[3] || match[1], 10); // Use m if it exists, otherwise use n
        }
        blocks[startIndex] = null; // Mark for removal
        startIndex++;
        hasRemovedBlocks = true;
    }

    // Check and remove unnecessary frames from the end
    if (blocks[endIndex] && blocks[endIndex].includes('[0(180)]')) {
        blocks[endIndex] = null; // Mark for removal
        endIndex--;
        hasRemovedBlocks = true;
    }

    // Adjust numbering if needed
    if (startIndex <= endIndex) {
        let adjustedBlocks = blocks.slice(startIndex, endIndex + 1).map(block => {
            if (block) {
                // Adjust headers by subtracting 'sub'
                return block.replace(/\{frames?#(\d+)(..#(\d+))?\}/, (match, p1, p2, p3) => {
                    let a = parseInt(p1, 10) - sub;
                    if (p3 !== undefined) {
                        let b = parseInt(p3, 10) - sub;
                        // Correcting the structure: if a == b, use {frame#a}, else use {frames#a..#b}
                        if (a === b) {
                            return `{frame#${a}}`;
                        } else {
                            return `{frames#${a}..#${b}}`;
                        }
                    } else {
                        return `{frame#${a}}`;
                    }
                });
            }
            return null;
        }).filter(block => block !== null);

        recordingText = adjustedBlocks.join('\n\n');
        textarea.value = recordingText.trim();

        if (hasRemovedBlocks) {
            showToast('The recording is ready\n(unnecessary frames from the beginning and end were removed)');
        } else {
            showToast('The recording is ready');
        }
    } else {
        recordingText = '';
        textarea.value = recordingText;
        showToast('No valid frames found.\nNothing was saved.');
    }
}

// this function looks for a frame in the textarea #recording and returns it
function getFrameData(frameNumber) {
    const textarea = document.getElementById('recording');

    const recordingText = textarea.value;
    const blocks = recordingText.split('\n\n').filter(block => block.trim() !== '');

    for (const block of blocks) {
        const frameMatch = block.match(/\{frames?#(\d+)(?:..#(\d+))?\}/);
        if (frameMatch) {
            const startFrame = parseInt(frameMatch[1], 10);
            const endFrame = frameMatch[2] ? parseInt(frameMatch[2], 10) : startFrame;

            if (frameNumber >= startFrame && frameNumber <= endFrame) {
                const contentMatch = block.match(/\[([^\]]+)\]/);
                if (contentMatch) {
                    return prepareFrameData(contentMatch[1]); // Return the content within the brackets
                }
            }
        }
    }

    console.warn(`Frame number ${frameNumber} not found.`);
    return null;
}

function prepareFrameData(data) {
    // Parse the compressed format
    const regex = /([A-Z0-9])\((\d+)\)/g;
    let expandedData = [];
    let match;

    // Extract each character and its count
    while ((match = regex.exec(data)) !== null) {
        const character = match[1];
        const count = parseInt(match[2], 10);
        expandedData.push(...Array(count).fill(character));
    }

    // Handle any remaining characters that are not in the format of "X(Y)"
    const remainingData = data.replace(regex, '').replace(/[\[\],]/g, '').trim();
    if (remainingData) {
        expandedData.push(...remainingData.split('').filter(char => char !== ''));
    }

    // Ensure there are exactly 180 values
    if (expandedData.length !== 180) {
        console.error('Data length is not 180 values.');
        return '';
    }

    // Format the output with 10 values per line
    const formattedData = expandedData.reduce((acc, value, index) => {
        if (index > 0 && index % 10 === 0) acc += '\n';
        acc += value + ',';
        return acc;
    }, '').slice(0, -1); // Remove trailing comma

    return formattedData;
}

recordButton.addEventListener('click', toggleRecording);
slider.addEventListener('input', adjustInterval);
window.addEventListener('load', async () => {
    await getCameras();
    adjustInterval(); // Set initial interval
});