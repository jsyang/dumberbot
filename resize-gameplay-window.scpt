#!/usr/bin/env osascript

on run argv
    set {width, height, scale} to words of (do shell script "system_profiler SPDisplaysDataType | awk '/Built-In: Yes/{found=1} /Resolution/{width=$2; height=$4} /Retina/{scale=($2 == \"Yes\" ? 2 : 1)} /^ {8}[^ ]+/{if(found) {exit}; scale=1} END{printf \"%d %d %d\\n\", width, height, scale}'")

    tell application "System Events" to tell application process "Boardspace Guest"
        tell window 1
            activate
            set {size, position} to {{1000, (height - 22)}, {0, 0}}
        end tell
    end tell
end run




(*

on run argv
    display alert (item 1 of argv)
end run

*)