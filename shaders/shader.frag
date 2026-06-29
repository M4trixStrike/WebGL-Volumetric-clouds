precision highp float;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

#define boundingAABB AABB(vec3(-40.,-1.,-40.),vec3(40.,1.,40.))
#define missedScene hitData(false,vec3(0.),vec3(0.),0.,0.)

#define FOV 32.
#define CAM vec3(0.,4.,0.)
#define CAM_ROTATION vec3(0.,0.,0.)

#define STEP_SIZE .2
#define LIGHT_STEP_SIZE .5

#define SUN vec3(20.,20.,50.)
#define SUN_COLOR vec3(.9,.9,.9)
#define SUN_INTENSITY 1.2

#define MAX_STEPS 1000000.


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

vec2 H22(vec2 p){

    p = fract(p*vec2(.123,.567));
    p = p + dot(p,p*12.67);
    return fract(p*fract(p.x*p.y));


}


float perlin3d(vec3 p, float scale){

    p *= scale;
    
    vec3 gv = smoothstep(0.,1.,fract(p));
    vec3 id = floor(p);
    
    // BACK
    
    vec3 b1 = H33(id);
    vec3 b2 = H33(id + vec3(1.,0.,0.));
    vec3 b3 = H33(id + vec3(0.,1.,0.));
    vec3 b4 = H33(id + vec3(1.,1.,0.));
    
    float b1d = dot(b1,gv);
    float b2d = dot(b2,gv - vec3(1.,0.,0.));
    float b3d = dot(b3,gv - vec3(0.,1.,0.));
    float b4d = dot(b4,gv - vec3(1.,1.,0.));
    
    float b12 = mix(b1d,b2d,gv.x);
    float b34 = mix(b3d,b4d,gv.x);
    
    float b1234 = mix(b12,b34,gv.y);
    
    // FRONT
    
    vec3 f1 = H33(id + vec3(0.,0.,1.));
    vec3 f2 = H33(id + vec3(1.,0.,1.));
    vec3 f3 = H33(id + vec3(0.,1.,1.));
    vec3 f4 = H33(id + vec3(1.,1.,1.));
    
    float f1d = dot(f1,gv - vec3(0.,0.,1.));
    float f2d = dot(f2,gv - vec3(1.,0.,1.));
    float f3d = dot(f3,gv - vec3(0.,1.,1.));
    float f4d = dot(f4,gv - vec3(1.,1.,1.));
    
    float f12 = mix(f1d,f2d,gv.x);
    float f34 = mix(f3d,f4d,gv.x);
    
    float f1234 = mix(f12,f34,gv.y);
    
    return mix(b1234,f1234,gv.z)*10.;

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

float volumetricDensityMap3d(vec3 p){

    vec3 cv = vec3(p);
    
    cv.x += uTime / 10. ;
   
    cv.z += uTime / 4.;

    
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

mat4 getRotationMatrix(vec3 rotAngles, vec3 org){

    float thetaX = radians(rotAngles.x);
    float thetaY = radians(rotAngles.y);
    float thetaZ = radians(rotAngles.z);

    mat4 t1 = mat4(
        1.0, 0.0, 0.0, 0.0, 
        0.0, 1.0, 0.0, 0.0,  
        0.0, 0.0, 1.0, 0.0,  
        org.x, org.y, org.z, 1.0 
    );

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

     mat4 t2 = mat4(
        1.0, 0.0, 0.0, 0.0, 
        0.0, 1.0, 0.0, 0.0,  
        0.0, 0.0, 1.0, 0.0,  
        -org.x, -org.y, -org.z, 1.0 
    );

    return t1 * mat4(rotX) * mat4(rotY) * mat4(rotZ) * t2;
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

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * uResolution.xy) / uResolution.y;

    float vpDist = 1.0 / tan(radians(FOV));
    vec3 rayDir = normalize(vec3(uv, vpDist));

    vec3 camRot = vec3(0.);

    camRot.y = uMouse.x * 360.;
    camRot.x = -uMouse.y * 90. + 23.;

    rayDir = vec3( vec4(rayDir,1.) * getRotationMatrix(camRot,CAM));

    ray r = ray(CAM, rayDir);

    vec3 skyColor = vec3(0.35, 0.52, 0.69);
    vec3 col = skyColor;

    hitData data = intersectScene(r, boundingAABB);

    if(data.hasHit) {

        float globalTransmittance = 1.0;
        vec3 cloudColor = vec3(0.);
        vec3 sunColor = SUN_COLOR * SUN_INTENSITY;

        float steps = distance(data.entryPoint, data.exitPoint);

        for(float s = 0.; s <= MAX_STEPS; s += STEP_SIZE) {
            if(s >= steps) break;

            vec3 marchPoint = getRayPoint(r, data.entryT + s);
            float density = volumetricDensityMap3d(marchPoint);

            if(density < 0.05)
                continue;

            float localTransmittance = exp(-density * STEP_SIZE);

            vec3 lightDir = normalize(SUN - marchPoint);
            ray lightR = ray(marchPoint, lightDir);

            hitData lightData = intersectScene(lightR, boundingAABB);
            float maxLightDist = lightData.exitT;

            float currentLightRayT = 1.0;

            for(float lS = STEP_SIZE; lS <= MAX_STEPS; lS += LIGHT_STEP_SIZE) {
                
                if(lS >= maxLightDist) break;
                
                vec3 lightMarchPoint = getRayPoint(lightR, lS);
                float lightDensity = volumetricDensityMap3d(lightMarchPoint);

                if(lightDensity < 0.05)
                    continue;

                currentLightRayT *= exp(-lightDensity * LIGHT_STEP_SIZE);
            }

            float scattering = (1. - localTransmittance) * currentLightRayT;

            cloudColor += globalTransmittance * scattering * sunColor;

            globalTransmittance *= localTransmittance;

            if(globalTransmittance < 0.01)
                break;
        }

        col = cloudColor + skyColor * globalTransmittance;
    }

    gl_FragColor = vec4(col, 1.0);
}