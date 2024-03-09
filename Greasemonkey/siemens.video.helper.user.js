// ==UserScript==
// @name        siemens.video.helper
// @namespace    http://holer.org/
// @version      0.1
// @description  Automatically opens captions on videos in Siemens documentation website
// @author       Russell Hong
// @match        https://docs.sw.siemens.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable captions for a single video element
    function enableCaptions(video) {
        if (video.textTracks && video.textTracks.length > 0) {
            for (let j = 0; j < video.textTracks.length; j++) {
                const track = video.textTracks[j];
                if (track.kind === 'subtitles' || track.kind === 'captions') {
                    track.mode = 'showing';
                }
            }
        }
    }

    // Initial execution for existing video elements
    const videos = document.getElementsByTagName('video');
    for (let i = 0; i < videos.length; i++) {
        enableCaptions(videos[i]);
    }

    // Set up MutationObserver to watch for new video elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'video') {
                        enableCaptions(node);
                    }
                });
            }
        });
    });

    // Start observing the whole document
    observer.observe(document.body, { childList: true, subtree: true });

})();