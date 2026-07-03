# WebGL Volumetric Cloud Renderer

This project is a real-time volumetric cloud rendering engine written in TypeScript and GLSL. \
The engine relies on a ray tracer and **fixed-step raymarcher** to simulate cloudlike structures.

## Demo images
<p align="center">
UI Preview
<img width="1915" height="942" alt="UI" src="https://github.com/user-attachments/assets/2290d00e-462d-477c-a624-c849d6e9828e" />
Renders <br/>
<img width="300" height="300" alt="view1" src="https://github.com/user-attachments/assets/00739577-603a-4a8f-85c7-0d3a758e9cab" />
<img width="300" height="300" alt="cloudGIF" src="https://github.com/user-attachments/assets/65ef0af0-b8b7-496a-b27d-550bebf0b72a" />
<img width="300" height="300" alt="view3" src="https://github.com/user-attachments/assets/efbc3f6a-9a28-49c5-9d53-897da4132df2" />
</p>

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
