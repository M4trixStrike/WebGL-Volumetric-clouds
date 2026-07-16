
export enum UniformType{

    FLOAT,
    VECTOR_FLOAT_2,
    VECTOR_FLOAT_3,
    VECTOR_FLOAT_4,
    INT,
    VECTOR_INT_2,
    VECTOR_INT_3,
    VECTOR_INT_4,
    MATRIX_2,
    MATRIX_3,
    MATRIX_4
}

export class UniformManager{

    private readonly glContext: WebGLRenderingContext;
    private readonly GLSLProgram: WebGLProgram;

    constructor(renderingContext: WebGLRenderingContext, program: WebGLProgram){

        this.glContext = renderingContext;
        this.GLSLProgram = program;

    }

    public setUniform(uType: UniformType, uName: string, uVector: number[]){

        const uLoc = this.glContext.getUniformLocation(this.GLSLProgram, uName);
        
        switch(uType){

            case UniformType.FLOAT:
                this.glContext.uniform1fv(uLoc,uVector);
                break;
            case UniformType.VECTOR_FLOAT_2:
                this.glContext.uniform2fv(uLoc,uVector);
                break;
            case UniformType.VECTOR_FLOAT_3:
                this.glContext.uniform3fv(uLoc,uVector);
                break;
            case UniformType.VECTOR_FLOAT_4:
                this.glContext.uniform4fv(uLoc,uVector);
                break;

            case UniformType.INT:
                this.glContext.uniform1iv(uLoc,uVector);
                break;
            case UniformType.VECTOR_INT_2:
                this.glContext.uniform2iv(uLoc,uVector);
                break;
            case UniformType.VECTOR_INT_3:
                this.glContext.uniform3iv(uLoc,uVector);
                break;
            case UniformType.VECTOR_INT_4:
                this.glContext.uniform4iv(uLoc,uVector);
                break;
            default:
                throw new Error(`Uniform [${uType}] is not supported nor recognized by this function!`);
        }

    }

    public setUniformMatrix(uType: UniformType, uName: string, uVector: number[], mTranspose: boolean){

        const uLoc = this.glContext.getUniformLocation(this.GLSLProgram, uName);

        switch(uType){

            case UniformType.MATRIX_2:
                this.glContext.uniformMatrix2fv(uLoc,mTranspose,uVector);
                break;
            case UniformType.MATRIX_3:
                this.glContext.uniformMatrix3fv(uLoc,mTranspose,uVector);
                break;
            case UniformType.MATRIX_4:
                this.glContext.uniformMatrix4fv(uLoc,mTranspose,uVector);
                break;
            default:
                throw new Error(`Uniform [${uType}] is not supported nor recognized by this function!`);
        }

    }

}

    