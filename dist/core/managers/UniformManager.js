export var UniformType;
(function (UniformType) {
    UniformType[UniformType["FLOAT"] = 0] = "FLOAT";
    UniformType[UniformType["VECTOR_FLOAT_2"] = 1] = "VECTOR_FLOAT_2";
    UniformType[UniformType["VECTOR_FLOAT_3"] = 2] = "VECTOR_FLOAT_3";
    UniformType[UniformType["VECTOR_FLOAT_4"] = 3] = "VECTOR_FLOAT_4";
    UniformType[UniformType["INT"] = 4] = "INT";
    UniformType[UniformType["VECTOR_INT_2"] = 5] = "VECTOR_INT_2";
    UniformType[UniformType["VECTOR_INT_3"] = 6] = "VECTOR_INT_3";
    UniformType[UniformType["VECTOR_INT_4"] = 7] = "VECTOR_INT_4";
    UniformType[UniformType["MATRIX_2"] = 8] = "MATRIX_2";
    UniformType[UniformType["MATRIX_3"] = 9] = "MATRIX_3";
    UniformType[UniformType["MATRIX_4"] = 10] = "MATRIX_4";
})(UniformType || (UniformType = {}));
export class UniformManager {
    glContext;
    GLSLProgram;
    constructor(renderingContext, program) {
        this.glContext = renderingContext;
        this.GLSLProgram = program;
    }
    setUniform(uType, uName, uVector) {
        const uLoc = this.glContext.getUniformLocation(this.GLSLProgram, uName);
        switch (uType) {
            case UniformType.FLOAT:
                this.glContext.uniform1fv(uLoc, uVector);
                break;
            case UniformType.VECTOR_FLOAT_2:
                this.glContext.uniform2fv(uLoc, uVector);
                break;
            case UniformType.VECTOR_FLOAT_3:
                this.glContext.uniform3fv(uLoc, uVector);
                break;
            case UniformType.VECTOR_FLOAT_4:
                this.glContext.uniform4fv(uLoc, uVector);
                break;
            case UniformType.INT:
                this.glContext.uniform1iv(uLoc, uVector);
                break;
            case UniformType.VECTOR_INT_2:
                this.glContext.uniform2iv(uLoc, uVector);
                break;
            case UniformType.VECTOR_INT_3:
                this.glContext.uniform3iv(uLoc, uVector);
                break;
            case UniformType.VECTOR_INT_4:
                this.glContext.uniform4iv(uLoc, uVector);
                break;
            default:
                throw new Error(`Uniform [${uType}] is not supported nor recognized by this function!`);
        }
    }
    setUniformMatrix(uType, uName, uVector, mTranspose) {
        const uLoc = this.glContext.getUniformLocation(this.GLSLProgram, uName);
        switch (uType) {
            case UniformType.MATRIX_2:
                this.glContext.uniformMatrix2fv(uLoc, mTranspose, uVector);
                break;
            case UniformType.MATRIX_3:
                this.glContext.uniformMatrix3fv(uLoc, mTranspose, uVector);
                break;
            case UniformType.MATRIX_4:
                this.glContext.uniformMatrix4fv(uLoc, mTranspose, uVector);
                break;
            default:
                throw new Error(`Uniform [${uType}] is not supported nor recognized by this function!`);
        }
    }
}
