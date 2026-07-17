precision highp float;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

uniform vec3 uUserSize;
uniform vec3 uUserSpeed;
uniform vec3 uUserSunPos;
uniform vec3 uUserSunColor;
uniform vec3 uRandomVector;

uniform float uUserControl;
uniform float uUserZoom;
uniform float uUserInt;
uniform float uUserScale;

#define missedScene hitData(false,vec3(0.),vec3(0.),0.,0.)

#define STEP_SIZE .15
#define LIGHT_STEP_SIZE .5

#define SKYBOX vec3(0.35, 0.52, 0.69)

#define MAX_STEPS 50.

struct ray{

    vec3 org;
    vec3 dir;

};

struct AABB {

    vec3 bMin;
    vec3 bMax;
    
};

struct hitData{

    bool hasHit;
    vec3 entryPoint;
    vec3 exitPoint;
    float entryT;
    float exitT;

};

vec3 H33(vec3 p){

    p = fract(p*vec3(.123,.345,.567));
    p = p + dot(p,p*12.67);
    return fract(p*fract(p.x*p.y*p.z));

}

vec3 H33S(vec3 p){

    return H33(p) * 2. - 1.;

}

float perlin3d(vec3 c, float f, float a){
    
    c *= f;
    
    // Grid setup
    vec3 gv = fract(c),
        id = floor(c),
        gvSmooth = smoothstep(0.,1.,gv);
    
    // Noise for Z = 0
    
    // Random corner vectors
    vec3 vBotLeft = H33S(id),
        vBotRight = H33S(id + vec3(1.,0.,0.) ),
        vTopLeft = H33S(id + vec3(0.,1.,0.) ),
        vTopRight = H33S(id + vec3(1.,1.,0.) );
        
    // Corner -> lUv vectors
    vec3 fromBotLeft = gv,
        fromBotRight = gv - vec3(1.,0.,0.),
        fromTopLeft = gv - vec3(0.,1.,0.),
        fromTopRight = gv - vec3(1.,1.,0.);
    
    // Vector dot products
    float dotBotLeft = dot(vBotLeft,fromBotLeft),
        dotBotRight = dot(vBotRight,fromBotRight),
        dotTopLeft = dot(vTopLeft,fromTopLeft),
        dotTopRight = dot(vTopRight,fromTopRight);
        
    // Linear interpolation of dot products
    
    float mixBotX = mix(dotBotLeft,dotBotRight,gvSmooth.x),
        mixTopX = mix(dotTopLeft,dotTopRight,gvSmooth.x);
    
    float z0 = mix(mixBotX,mixTopX,gvSmooth.y);
    
    // Noise for Z = 1
    
    // Random corner vectors
    vBotLeft = H33S(id + vec3(0.,0.,1.) ),
        vBotRight = H33S(id + vec3(1.,0.,1.) ),
        vTopLeft = H33S(id + vec3(0.,1.,1.) ),
        vTopRight = H33S(id + vec3(1.,1.,1.) );
        
    // Corner -> lUv vectors
    fromBotLeft = gv - vec3(0.,0.,1.),
        fromBotRight = gv - vec3(1.,0.,1.),
        fromTopLeft = gv - vec3(0.,1.,1.),
        fromTopRight = gv - vec3(1.,1.,1.);
    
    // Vector dot products
    dotBotLeft = dot(vBotLeft,fromBotLeft),
        dotBotRight = dot(vBotRight,fromBotRight),
        dotTopLeft = dot(vTopLeft,fromTopLeft),
        dotTopRight = dot(vTopRight,fromTopRight);
        
    // Linear interpolation of dot products
    
    mixBotX = mix(dotBotLeft,dotBotRight,gvSmooth.x),
        mixTopX = mix(dotTopLeft,dotTopRight,gvSmooth.x);
    
    float z1 = mix(mixBotX,mixTopX,gvSmooth.y);
    
    return mix(z0,z1,gvSmooth.z) * a;

}

float worley3d(vec3 p, float f, float a){

    p *= f;
    
    vec3 gv = fract(p);
    vec3 id = floor(p);
    
    float sDist = 4.;
    
    for(int z = -1; z <= 1; z++){
        for(int y = -1; y <= 1; y++){
            for(int x = -1; x <= 1; x++){

                vec3 o = vec3(x,y,z);

                float nDist = distance(gv,o+H33(id+o));
                if(nDist < sDist) sDist = nDist;

            }
        }
    }
    
    return sDist * a;

}

float volumetricDensityMap3d(vec3 p, vec3 offs, float scale){

    vec3 cv = vec3(p);

    cv += offs;

    cv *= scale;
    
    // Inverted 3D Worley normalized to be between -1 and 1?
    float wor1 = (1. - worley3d(cv,1.,1.) ) * 2. - 1.;

    float p1 = perlin3d(cv,1.,8.),
        p2 = perlin3d(cv,2.,4.),
        p3 = perlin3d(cv,4.,2.),
        p4 = perlin3d(cv,8.,1.),
        p5 = perlin3d(cv,16.,.5),
        p6 = perlin3d(cv,32.,.25);
    
    
    float col = p1 + p2 + p3 + p4 + p5 + p6 + wor1;
    
    return max(0.,col-.2);

}

vec3 getRayPoint(ray r, float t){

    return r.org + t * r.dir;

}

mat3 getRotationMatrix(vec3 rotAngles){

    float thetaX = radians(rotAngles.x);
    float thetaY = radians(rotAngles.y);
    float thetaZ = radians(rotAngles.z);

    mat3 rotX = mat3(
        1.,0.,0.,
        0.,cos(thetaX),-sin(thetaX),
        0.,sin(thetaX),cos(thetaX)
    );

    mat3 rotY = mat3(
        cos(thetaY),0.,sin(thetaY),
        0.,1.,0.,
        -sin(thetaY),0.,cos(thetaY)
    );

    mat3 rotZ = mat3(
        cos(thetaZ),-sin(thetaZ),0.,
        sin(thetaZ),cos(thetaZ),0.,
        0.,0.,1.
    );


    return rotX * rotY * rotZ;
}

hitData intersectScene(ray r, AABB aabb) {
    
    vec3 dirFrac = 1.0 / r.dir;

    vec3 t1 = (aabb.bMin - r.org) * dirFrac;
    vec3 t2 = (aabb.bMax - r.org) * dirFrac;

    vec3 tMinVec = min(t1, t2);
    vec3 tMaxVec = max(t1, t2);

    float tmin = max(max(tMinVec.x, tMinVec.y), tMinVec.z);
    float tmax = min(min(tMaxVec.x, tMaxVec.y), tMaxVec.z);

    if (tmax < 0.) return missedScene;

    if (tmin > tmax) return missedScene;

    return hitData(
        true,
        getRayPoint(r,tmin),
        getRayPoint(r,tmax),
        tmin,
        tmax
    );
}

bool pointInAabb(vec3 p, AABB boundingBox){

    return (
        p.x >= boundingBox.bMin.x &&
        p.x <= boundingBox.bMax.x &&
        p.y >= boundingBox.bMin.y &&
        p.y <= boundingBox.bMax.y &&
        p.z >= boundingBox.bMin.z &&
        p.z <= boundingBox.bMax.z
    );

}

vec3 getRayDirection(vec2 uv, vec3 cameraPos, vec3 lookat, float zoom){

    vec3 camDir = normalize(lookat-cameraPos),
        camX = normalize(cross(vec3(0.,1.,0.), camDir)),
        camY = cross(camDir,camX),
        vpCenter = cameraPos + camDir * zoom,
        vpPoint = vpCenter + uv.x * camX + uv.y * camY;

    return normalize(vpPoint-cameraPos);
}

vec3 rayMarchCloud(vec2 uv, vec3 camera, mat3 camRot, vec3 textureOffset,  AABB boundingBox){

    vec3 newCamPos = camera * camRot,
        rd = getRayDirection(uv,newCamPos,vec3(0.),1.);

    ray r = ray(newCamPos, rd);
    
    bool camInClouds = pointInAabb(newCamPos,boundingBox);
    
    vec3 col = SKYBOX;

    float LightDot = dot(r.dir,normalize(uUserSunPos - r.org));
    if(LightDot > .9995)
        col = mix(SKYBOX,uUserSunColor,(LightDot - .9995) * 3000. * uUserInt);

    hitData data = intersectScene(r, boundingBox);

    if(data.hasHit) {

        float globalTransmittance = 1.0;
        vec3 cloudColor = vec3(0.);
        vec3 sunColor = uUserSunColor * uUserInt;

        float steps = distance(camInClouds?newCamPos:data.entryPoint, data.exitPoint);

        for(float s = 0.; s <= MAX_STEPS; s += STEP_SIZE) {
            if(s >= steps) break;

            vec3 marchPoint = getRayPoint(r, camInClouds?s:data.entryT + s);
            float density = volumetricDensityMap3d(marchPoint,textureOffset,uUserScale);

            if(density < 0.05)
                continue;

            float localTransmittance = exp(-density * STEP_SIZE);

            vec3 lightDir = normalize(uUserSunPos - marchPoint);
            ray lightR = ray(marchPoint, lightDir);

            hitData lightData = intersectScene(lightR, boundingBox);
            float maxLightDist = lightData.exitT;

            float currentLightRayT = 1.0;

            for(float lS = STEP_SIZE; lS <= MAX_STEPS; lS += LIGHT_STEP_SIZE) {
                
                if(lS >= maxLightDist) break;
                
                vec3 lightMarchPoint = getRayPoint(lightR, lS);
                float lightDensity = volumetricDensityMap3d(lightMarchPoint,textureOffset,uUserScale);

                if(lightDensity < 0.05)
                    continue;

                currentLightRayT *= exp(-lightDensity * LIGHT_STEP_SIZE);
            }

            float scattering = (1. - localTransmittance) * currentLightRayT;

            cloudColor += globalTransmittance * scattering * sunColor;

            globalTransmittance *= localTransmittance;

            if(globalTransmittance < 0.15)
                break;
        }

        col = cloudColor + col * max(globalTransmittance,.3);
    }

    return col;

}

void main() {

    vec2 uv = (gl_FragCoord.xy - .5 * uResolution.xy) / uResolution.y;

    vec3 CAM = vec3(0.,0.,uUserZoom);

    AABB uBoundingBox;

    uBoundingBox.bMin.x -= uUserSize.x;
    uBoundingBox.bMax.x += uUserSize.x;

    uBoundingBox.bMin.y -= uUserSize.y;
    uBoundingBox.bMax.y += uUserSize.y;

    uBoundingBox.bMin.z -= uUserSize.z;
    uBoundingBox.bMax.z += uUserSize.z;

    mat3 camRot;
    
    if(uUserControl != 1.){

        camRot = getRotationMatrix(vec3(0.,-mod(uTime*5.,350.),0.));

    }
    else{

        camRot = getRotationMatrix(vec3(-(uMouse.y-.5)*175.,(uMouse.x-.5)*360.,0.));

    }

    vec3 userOffset = vec3(uTime*uUserSpeed.x,uTime*uUserSpeed.y,uTime*uUserSpeed.z) + uRandomVector;
    vec3 col = rayMarchCloud(uv,CAM,camRot,userOffset,uBoundingBox);

    gl_FragColor = vec4(col, 1.0);
}