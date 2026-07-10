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

#define boundingAABB AABB(vec3(-4.,-4.,-4.),vec3(4.,4.,4.))

#define missedScene hitData(false,vec3(0.),vec3(0.),0.,0.)

#define FOV 32.

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

vec3 H33s(vec3 p){

    return H33(p) * 2. - 1.;

}

float perlin3d(vec3 p, float scale){

    p *= scale;
    
    vec3 gv = fract(p);
    vec3 gvSmooth = smoothstep(0.,1.,fract(p));
    vec3 id = floor(p);
    
    // BACK
    
    vec3 b1 = H33s(id);
    vec3 b2 = H33s(id + vec3(1.,0.,0.));
    vec3 b3 = H33s(id + vec3(0.,1.,0.));
    vec3 b4 = H33s(id + vec3(1.,1.,0.));
    
    float b1dot = dot(b1,gv);
    float b2dot = dot(b2,gv - vec3(1.,0.,0.));
    float b3dot = dot(b3,gv - vec3(0.,1.,0.));
    float b4dot = dot(b4,gv - vec3(1.,1.,0.));
    
    float b12 = mix(b1dot,b2dot,gvSmooth.x);
    float b34 = mix(b3dot,b4dot,gvSmooth.x);
    
    float b1234 = mix(b12,b34,gvSmooth.y);
    
    // FRONT
    
    vec3 f1 = H33s(id + vec3(0.,0.,1.));
    vec3 f2 = H33s(id + vec3(1.,0.,1.));
    vec3 f3 = H33s(id + vec3(0.,1.,1.));
    vec3 f4 = H33s(id + vec3(1.,1.,1.));
    
    float f1dot = dot(f1,gv - vec3(0.,0.,1.));
    float f2dot = dot(f2,gv - vec3(1.,0.,1.));
    float f3dot = dot(f3,gv - vec3(0.,1.,1.));
    float f4dot = dot(f4,gv - vec3(1.,1.,1.));
    
    float f12 = mix(f1dot,f2dot,gvSmooth.x);
    float f34 = mix(f3dot,f4dot,gvSmooth.x);
    
    float f1234 = mix(f12,f34,gvSmooth.y);
    
    return mix(b1234,f1234,gvSmooth.z)*5.;

}

float worley3d(vec3 p, float scale){

    p *= scale;
    
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
    
    return sDist;

}

float volumetricDensityMap3d(vec3 p, vec3 offs){

    vec3 cv = vec3(p);

    cv += offs;
    
    float wor1 = 1.-worley3d(cv,1.)*.9;

    float p1 = perlin3d(cv,.25)*0.8;
    float p2 = perlin3d(cv,.5)*0.4;
    float p3 = perlin3d(cv, 1.)*0.2;
    float p4 = perlin3d(cv,2.)*0.1;
    float p5 = perlin3d(cv,4.)*0.05;
    float p6 = perlin3d(cv,8.)*0.025;
    
    
    float col = p1 + p2 + p3 + p4 + p5 + p6 + wor1;
    
    return max(0.,col-.5);

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

vec3 rayMarchCloud(vec2 uv, vec3 camera, float zoom, mat3 camRot, vec3 lookat,  AABB boundingBox){

    vec3 newCamPos = camera * camRot,
        userOffset = vec3(uTime*uUserSpeed.x,uTime*uUserSpeed.y,uTime*uUserSpeed.z) + uRandomVector,
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
            float density = volumetricDensityMap3d(marchPoint,userOffset);

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
                float lightDensity = volumetricDensityMap3d(lightMarchPoint,userOffset);

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

    mat3 camRot;;
    
    if(uUserControl != 1.){

        camRot = getRotationMatrix(vec3(0.,-mod(uTime*5.,350.),0.));

    }
    else{

        camRot = getRotationMatrix(vec3(-(uMouse.y-.5)*175.,(uMouse.x-.5)*360.,0.));

    }

    vec3 col = rayMarchCloud(uv,CAM,1.,camRot,vec3(0.),uBoundingBox);

    gl_FragColor = vec4(col, 1.0);
}