# WebGL Volumetric Cloud Renderer

This project is a real-time volumetric cloud rendering engine written in TypeScript and GLSL. \
The engine relies on a ray tracer and **fixed-step raymarcher** to simulate cloudlike structures.

## Demo images

## Features

- Volumetric rendering
    - Fixed-Step Raymarching
    - Beer's Law implementation
    - Worley & Perlin noise for density sampling
    - Ambient light & Light colors

<br>

**User interface** \
Provided user interface allows for quick modification of some parameters like: cloud bounding box size, noise offsets, light colors and more.

### Tuning cloud quality 

Due to WebGL 1 limitation regarding dynamic loop bounds, the step sizes are hardcoded as constants int the`shader.frag` file. \
To increase cloud quality, decrease `STEP_SIZE` and `LIGHT_STEP_SIZE` constants.

## How to run

The engine is based on JavaScript modules to link files. Because of this, the application has to be server over HTTP or HTTPS.

### Before you start:

1. Run the `npm install` command to download dependencies.
2. Start a local development server (for example `Live Server`, `http-server`, or any similar tool)
3. Open the project in your browser via the local server URL