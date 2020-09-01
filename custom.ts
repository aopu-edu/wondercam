
/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */

enum Functions {
    //% block="无功能"
    NoFunction,
    //% block="人脸识别"
    FaceDetect = 1,
    //% block="物品识别"
    ObjectDetect,
    //% block="图像分类"
    Classification,
    //% block="特征学习"
    FeatureLeanrning,
    //% block="颜色识别"
    ColorDetect,
    //% block="视觉巡线"
    LineFollowing,
    //% block="二维码识别"
    QrcodeScan,    
    //% block="条形码识别"
    BarcodeScan
}

enum Ojbects {
    //% block="飞机"
    Aeroplane = 1,
    //% block="自行车"
    Bicycle,
    //% block="鸟"
    Bird,
    //% block="船"
    Boar,
    //% block="瓶子"
    Bootle,
    //% block="巴士"
    Bus,
    //% block="汽车"
    Car,
    //% block="猫"
    Cat,
    //% block="椅子"
    Chair,
    //% block="牛"
    Cow,
    //% block="餐桌"
    Diningtable,
    //% block="狗"
    Dog,
    //% block="马"
    Horse,
    //% block="摩托车"
    Motorbike,
    //% block="人"
    Person,
    //% block="盆栽"
    Pottedplant,
    //% block="羊"
    Sheep,
    //% block="沙发"
    Sofa,
    //% block="火车"
    Train,
    //% block="显示器"
    TvMonitorn
}

enum Options {
    //% block="X坐标"
    Pos_X = 0,
    //% block="Y坐标"
    Pos_Y = 0x02,
    //% block="宽度"
    Width = 0x04,
    //% block="高度"
    Height = 0x06
}

enum Obj_Options {
    //% block="X坐标"
    Pos_X = 0,
    //% block="Y坐标"
    Pos_Y = 0x02,
    //% block="宽度"
    Width = 0x04,
    //% block="高度"
    Height = 0x06,
    //% block="置信度"
    Confidence = 0x08
}

enum Line_Options {
    //% block="起始点X坐标"
    Start_X = 0x00,
    //% block="起始点Y坐标"
    Start_Y = 0x02,
    //% block="结束点X坐标"
    END_X = 0x04,
    //% block="结束点Y坐标"
    END_Y = 0x06,
    //% block="夹角"
    Theta = 0x08,
    //% block="偏移"
    Rho = 0x0A
}

/**
 * 自定义图形块
 */
//% weight=100 color=#FF8844 icon=""
namespace WonderCam {
    let Current = Functions.NoFunction;
    let ResultBuf:Buffer;
    const WONDERCAM_I2C_ADDR = 0x32
    function i2cwrite(reg: number, value: number) {
        let buf = pins.createBuffer(3)
        buf.setNumber(NumberFormat.UInt8LE, 0, reg & 0xFF)
        buf.setNumber(NumberFormat.UInt8LE, 1, (reg >> 8) & 0xFF)
        buf.setNumber(NumberFormat.UInt8LE, 2, value & 0xFF)
        pins.i2cWriteBuffer(WONDERCAM_I2C_ADDR, buf)
    }

    function i2creadtobuf(reg:number, length: number): Buffer{
        let buf = pins.createBuffer(2)
        buf.setNumber(NumberFormat.UInt8LE, 0, reg & 0xFF)
        buf.setNumber(NumberFormat.UInt8LE, 1, (reg >> 8) & 0xFF)
        pins.i2cWriteBuffer(WONDERCAM_I2C_ADDR, buf)
        return pins.i2cReadBuffer(WONDERCAM_I2C_ADDR, length)
    }
    function i2creadnum(reg: number): number {
        let buf = i2creadtobuf(reg, 1)
        return buf.getNumber(NumberFormat.UInt8LE, 0)
    }
    /**
     * TODO:初始化I2C， 初始化WonderCam 
    */
    //% weight=180
    //% block="初始化WonderCam"
    export function wondercam_init(): void {
        while(i2creadnum(0) != 'v'.charCodeAt(0)){
            basic.showString("E")
        }
        basic.clearScreen()
    }
    /**
     * TODO: 获取WonderCam正在运行的功能，返回当前运行功能的序号
     */
    //% weight=40
    //% block="正在运行的功能"
    export function CurrentFunc(): Functions {
        return i2creadnum(0x0035)
    }
    /**
     * TODO: 判断当前运行的功能是否是某个功能
     */
    //% weight=149
    //% block="正在运行的功能是否是%func"
    //% func.defl=Functions.FaceDetect
    export function CurrentFuncIs(func:Functions): boolean {
        if(i2creadnum(0x0035) == func) {
            return true
        }
        return false
    }
    /**
     * TODO: 获取不同功能对应的功能序号
     */
    //% weight=30
    //% block="%func"
    //% func.defl=Functions.FaceDetect
    export function FunctoNum(func:Functions): number {
        return func
    }
    /**
     * TODO: 切换功能
     */
    //% weight=140
    //% block="切换到%newfunc功能"
    //% newfunc.defl=Functions.FaceDetect
    export function ChangeFunc(newfunc:Functions): void {
    }
    /**
     * TODO: 更新WonderCam的处理结果
     */
    //% weight=120
    //% block="更新并获取结果"
    export function UpdateResult(): void {
        let func = CurrentFunc()
        switch(func){
            case Functions.FaceDetect: //人脸识别 结果地址
                ResultBuf=i2creadtobuf(0x0400, 512)
                Current = Functions.FaceDetect;
                break;
            case 2: //物品识别 结果地址
                ResultBuf=i2creadtobuf(0x0800, 512)
                Current = Functions.ObjectDetect
                break;
            case 3: //图像分类 结果地址
                ResultBuf=i2creadtobuf(0x0C00, 128)
                Current = Functions.Classification
                break;
            case 4:  //特征学习 结果地址
                break;
            case 5: // 颜色识别 结果地址
                ResultBuf=i2creadtobuf(0x1000, 400)
                Current = Functions.ColorDetect
                break;
            case 6: //视觉巡线 结果地址
                ResultBuf=i2creadtobuf(0x1400, 256)
                Current = Functions.LineFollowing
                break;
            case 7: //QRCODE 结果地址
                ResultBuf=i2creadtobuf(0x1800, 512)
                Current = Functions.QrcodeScan
                break;
            case 8: //BAR CODE 结果地址
                ResultBuf=i2creadtobuf(0x1C00, 512)
                Current = Functions.BarcodeScan
                break;
            default:
                Current = Functions.NoFunction
                break;
        }
    }

    /**
     * TODO: 是否检测到了人脸
     */
    //% weight=160
    //% block="是否检测到人脸"
    //% subcategory=人脸识别
    export function IsDetectFace(): boolean {
        if(Current == Functions.FaceDetect){
            if(ResultBuf.getNumber(NumberFormat.UInt8LE, 2) > 0){
                return true
            }
        }
        return false
    } 

    /**
     * TODO: 获取识别到的人脸个数
     */
    //% weight=150
    //% block="检测到的全部人脸个数"
    //% subcategory=人脸识别
    export function FaceNum(): number {
        if(Current == Functions.FaceDetect){
            return ResultBuf.getNumber(NumberFormat.UInt8LE, 1);
        }
        return 0;
    }
     /**
     * TODO: 获取识别到的已经学习的人脸个数
     */
    //% weight=140
    //% block="是否识别到已学习人脸"
    //% subcategory=人脸识别
    export function IsDetectedLeanedFace(): boolean {
        if(Current == Functions.FaceDetect){
            if(ResultBuf.getNumber(NumberFormat.UInt8LE, 2) > 0){
                return true;
            }
        }
        return false;
    }  
    /**
     * TODO: 获取识别到的已经学习的人脸个数
     */
    //% weight=135
    //% block="识别到的已学习人脸个数"
    //% subcategory=人脸识别
    export function LeanedFaceNum(): number {
        if(Current == Functions.FaceDetect){
            return ResultBuf.getNumber(NumberFormat.UInt8LE, 2);
        }
        return 0;
    }
    /**
     * TODO: 获取识别到的未学习的人脸个数
     */
    //% weight=130
    //% block="是否检测到的未学习人脸"
    //% subcategory=人脸识别
    export function IsDetectUnLeanedFace(): boolean {
        if(Current == Functions.FaceDetect){
            if(ResultBuf.getNumber(NumberFormat.UInt8LE, 3) > 0){
                return true;
            }
        }
        return false;
    }  
    /**
     * TODO: 获取识别到的未学习的人脸个数
     */
    //% weight=120
    //% block="检测到的未学习人脸个数"
    //% subcategory=人脸识别
    export function UnLeanedFaceNum(): number {
        if(Current == Functions.FaceDetect){
            return ResultBuf.getNumber(NumberFormat.UInt8LE, 3);
        }
        return 0;
    }
    /**
     * TODO: 是否识别到了指定ID的人脸
     */
    //% weight=110
    //% block="是否识别到了 人脸ID:%id"
    //% id.defl=1 id.min=1 id.max=5
    //% subcategory=人脸识别
    export function IsDetectedFace(id: number): boolean {
        if(Current == Functions.FaceDetect){
            for(let i = 4; i < 4 + 29; i++){  // 逐个对比是否有这个id
                if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
                    return true;
                }
            }
        }
        return false;
    } 

    /**
     * TODO: 获返回指定ID的人脸的位置数据。若成功返回数据,失败返回0
     */
    //% weight=95
    //% block="人脸ID:%id的%opt"
    //% id.defl=1 id.min=1 id.max=5
    //% opt.defl=Options.Pos_X
    //% subcategory=人脸识别
    export function getlearnedFaceY(id: number, opt:Options): number {
        for(let i = 4; i < 4 + 29; i++){  // 逐个对比是否有这个id
            if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id) {
                let index = i - 4;
                return ResultBuf.getNumber(NumberFormat.Int16LE, (0x30 + opt) + index * 16)
            }
        }
        return 0;
    }

    /**
     * TODO: 获返回指定Index的未学习的人脸的位置数据。若成功返回数据,失败返回0
     */
    //% weight=13
    //% block="识别到的第%index个未学习人脸的%opt"
    //% index.defl=1 index.min=1 index.max=20
    //% opt.defl=Options.Pos_X
    //% subcategory=人脸识别
    export function getUnlearnedFaceX(index:number, opt:Options): number {
        let num = 0;
        for(let i = 4; i < 4 + 29; i++) {  // 逐个对比是否有这个id
            if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == 0xFF) {
                num += 1
                if(num == index){
                    return ResultBuf.getNumber(NumberFormat.Int16LE, (0x30 + opt) + (i - 4) * 16)
                }
            }
        }
        return 0;
    }

    /**
     * TODO: 是否识别到了物品
     */
    //% weight=100 block="是否识别到了物品"
    //% subcategory=物品识别
    export function IsDetectObject(): boolean {
        if(Current == Functions.ObjectDetect){
            if( ResultBuf.getNumber(NumberFormat.UInt8LE, 1) > 0){
                return true
            }
        }
        return false
    }
    /**
     * TODO: 获取识别到的物品总数
     */
    //% weight=97 blockId=ObjNum block="识别到的物品总数"
    //% subcategory=物品识别
    export function ObjNum(): number {
        if(Current == Functions.ObjectDetect){
            return ResultBuf.getNumber(NumberFormat.UInt8LE, 1);
        }else{
            return 0;
        }
    }

    /**
     * TODO: 是否识别到了指定ID的物品
     */
    //% weight=95 blockId=IsDetectedObject block="是否识别到了%d"
    //% subcategory=物品识别
    export function IsDetectedObjectOfId(id:Ojbects): boolean {
        if(Current == Functions.ObjectDetect){
            for(let i = 2; i < 2 + 29; i++){  // 逐个对比是否有这个id
                if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
                    return true;
                }
            }
            return false;
        }else{
            return false;
        }
    }
     
    /**
     * TODO: 识别到的指定ID的物品的个数
     */
    //% weight=85  block="识别到的%id的个数"
    //% subcategory=物品识别
    export function NumOfDetectedObject(id:Ojbects): number {
        let num = 0;
        if(Current == Functions.ObjectDetect){
            for(let i = 2; i < 2 + 29; i++){  // 逐个对比是否有这个id
                if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
                    num += 1;
                }
            }
        }
        return num;
    }
    /**
     * TODO: 获取识别到的指定物品的指定序号的结果的数据
     */
    //% weight=75 block="识别到的第%index个%id的%opt"
    //% index.defl=1 index.min=1 index.max=29
    //% opt.defl=Obj_Options.Pos_X
    //% subcategory=物品识别
    export function getObjectW(index: number, id:Ojbects, opt:Obj_Options): number {
        let num = 0
        let addr = 0
        if(Current == Functions.ObjectDetect) {
            for(let i = 2; i < 2 + 29; i++){  // 逐个对比是否有这个id
                if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
                    num += 1
                    if(num == index){
                        return ResultBuf.getNumber(NumberFormat.UInt16LE, (0x30 + opt) + (i - 2) * 16)
                    }
                }
            }
        }
        return 0
    }    
    
    //图像分类
    /**
     * TODO: 获取置信度最大的ID
     */
    //% weight=82 blockId=MaxConfidenceID block="置信度最大的ID"
    //% id.defl=1 id.min=1 id.max=20
    //% subcategory=图像分类
    export function MaxConfidenceID(): number {
        if(Current == Functions.Classification) {
             return ResultBuf.getNumber(NumberFormat.UInt8LE, 0x01);
        }
        return 0
    } 
    //图像分类
    /**
     * TODO: 获取最大的置信度
     */
    //% weight=81 blockId=MaxConfidence block="最大的置信度"
    //% id.defl=1 id.min=1 id.max=20
    //% subcategory=图像分类
    export function MaxConfidence(): number {
        if(Current == Functions.Classification) {
             let c = ResultBuf.getNumber(NumberFormat.UInt16LE, 0x02);
             return (c / 10000.0)
        }
        return 0
    } 
    /**
     * TODO: 获取指定ID的的置信度
     */
    //% weight=80 blockId=ConfidenceOfId block="ID:%id的置信度"
    //% id.defl=1 id.min=1 id.max=20
    //% subcategory=图像分类
    export function ConfidenceOfIdClassification(id:number): number {
        if(Current == Functions.Classification) {
            let c = ResultBuf.getNumber(NumberFormat.UInt16LE, 0x10 + ((id - 1) * 4))
            return (c / 10000.0)
        }
        return 0
    } 
    //颜色识别
    /**
     * TODO: 是否识别到了色块
     */
    //% weight=99 block="是否识别到了颜色"
    //% subcategory=颜色识别
    export function IsDetectedColorblobs(): boolean {
        if(Current == Functions.ColorDetect){
            if(ResultBuf.getNumber(NumberFormat.UInt8LE, 0x01) > 0){
                return true;
            }
        }
        return false
    }
    /**
     * TODO: 识别到的色块总数
     */
    //% weight=90 block="识别到的颜色总数"
    //% subcategory=颜色识别
    export function NumberOfColorblobs(): number {
        if(Current == Functions.ColorDetect){
            return ResultBuf.getNumber(NumberFormat.UInt8LE, 0x01);
        }
        return 0
    } 
    /**
     * TODO: 是否识别到了指定ID的颜色
     */
    //% weight=80 block="是否识别到了颜色ID:%id"
    //% id.defl=1 id.min=1 id.max=7
    //% subcategory=颜色识别
    export function isDetectedColorId(id:number): boolean {
        let num = NumberOfColorblobs()
        if(Current == Functions.ColorDetect){
            for(let i = 2; i < 2 + num; i++){  // 逐个对比是否有这个id
                if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
                    return true;
                }
            }
        }
        return false
    } 
    /**
     * TODO: 返回指定ID颜色的位置数据
     */
    //% weight=75 block="颜色ID:%id的%opt"
    //% id.defl=1 id.min=1 id.max=7
    //% opt.defl=Options.Pos_X
    //% subcategory=颜色识别
    export function XOfColorId(id:number, opt: Options): number {
        let num = NumberOfColorblobs()
        if(Current == Functions.ColorDetect){
            for(let i = 2; i < 2 + num; i++){  // 逐个对比是否有这个id
                if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
                    return ResultBuf.getNumber(NumberFormat.Int16LE, (0x30 + opt) + ((i - 2) * 16));
                }
            }
        }
        return 0
    }

    //视觉巡线
    /**
     * TODO: 是否识别到了线
     */
    //% weight=100 block="是否识别到了线"
    //% subcategory=视觉巡线
    export function isDetectedLine(): boolean {
        let num = NumberOfLines()
        if(Current == Functions.LineFollowing){
            if(ResultBuf.getNumber(NumberFormat.UInt8LE, 0x01) > 0){
                return true;
            }
        }
        return false
    } 
    /**
     * TODO: 识别到的线总数
     */
    //% weight=90 block="识别到的线的总数"
    //% subcategory=视觉巡线
    export function NumberOfLines(): number {
        if(Current == Functions.LineFollowing){
            return ResultBuf.getNumber(NumberFormat.UInt8LE, 0x01);
        }
        return 0
    } 
    /**
     * TODO: 是否识别到了指定ID的线
     */
    //% weight=85 block="是否识别到了线条ID:%id"
    //% id.defl=1 id.min=1 id.max=3
    //% subcategory=视觉巡线
    export function isDetectedLineId(id:number): boolean {
        let num = NumberOfLines()
        if(Current == Functions.LineFollowing){
            for(let i = 2; i < 2 + num; i++){  // 逐个对比是否有这个id
                if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
                    return true;
                }
            }
        }
        return false
    } 
    /**
     * TODO: 返回指定ID的线的位置数据
     */
    //% weight=80 block="线条ID:%id的%opt"
    //% id.defl=1 id.min=1 id.max=3
    //% opt.defl=Line_Options
    //% subcategory=视觉巡线
    export function StartXOfLineId(id:number, opt:Line_Options): number {
        let num = NumberOfLines()
        if(Current == Functions.LineFollowing){
            for(let i = 2; i < 2 + num; i++){  // 逐个对比是否有这个id
                if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
                    return ResultBuf.getNumber(NumberFormat.Int16LE, (0x30 + opt) + ((i - 2) * 16));
                }
            }
        }
        return 0
    }

    //QrCode 
    /**
     * TODO: 是否识别到了二维码
     */
    //% weight=100 block="是否识别到二维码"
    //% subcategory=二维码识别
    export function isDetectedQrCode(): boolean {
        let num = NumberOfLines()
        if(Current == Functions.QrcodeScan){
            if(ResultBuf.getNumber(NumberFormat.Int8LE, 0x01) > 0){
                return true;
            }
        }
        return false
    } 
    /**
     * TODO: 是否识别到了指定ID的二维码
     */
    //% weight=90 block="是否识别到了ID:%id二维码"
    //% id.defl=1 id.min=1 id.max=5
    //% subcategory=二维码识别
    // export function isDetecteQrCodeId(id:number): boolean {
        // let num = NumberOfLines()
        // if(Current == Functions.QrcodeScan){
            // for(let i = 2; i < num; i++){  // 逐个对比是否有这个id
                // if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
                    // return true;
                // }
            // }
        // }
        // return false
    // }
    /**
     * TODO: 识别到的二维码的数据长度
     */
    //% weight=80 block="识别到的二维码的数据长度"
    //% subcategory=二维码识别
    export function LengthOfQrCodeData(): number {
        if(Current == Functions.QrcodeScan){
            return ResultBuf.getNumber(NumberFormat.UInt16LE, 0x20)
        }
        return 0
    } 
    /**
     * TODO: 以字符串形式返回识别到的二维码的数据
     */
    //% weight=70 block="识别到的二维码数据字符串"
    //% subcategory=二维码识别
    export function StringFromQrCodeData(): string {
        if(Current == Functions.QrcodeScan){
            return ResultBuf.slice(0x30, LengthOfQrCodeData()).toString()
        }
        return ""
    } 
    /**
     * TODO: 以数组形式返回识别到的二维码的数据
     */
    //% weight=60 block="识别到的二维码数据数组"
    //% subcategory=二维码识别
    export function ArrayFromQrCodeData(): Array<number> {
        if(Current == Functions.QrcodeScan){
            return ResultBuf.slice(0x30, LengthOfQrCodeData()).toArray(NumberFormat.UInt8LE)
        }
        return []
    }
    //
    //BarCode 
    /**
     * TODO: 是否识别到了条形码
     */
    //% weight=100 block="是否识别到了条形码"
    //% subcategory=条形码识别
    export function isDetectedBarCode(): boolean {
        let num = NumberOfLines()
        if(Current == Functions.BarcodeScan){
            if(ResultBuf.getNumber(NumberFormat.Int8LE, 0x01) > 0){
                return true
            }
        }
        return false
    } 
    /**
     * TODO: 是否识别到了指定ID的条形码
     */
    //% weight=90 block="是否识别到了ID:%id条形码"
    //% id.defl=1 id.min=1 id.max=5
    //% subcategory=条形码识别
   // export function isDetectedBarCodeId(id:number): boolean {
   //     let num = NumberOfLines()
   //     if(Current == Functions.BarcodeScan){
   //         for(let i = 2; i < num; i++){  // 逐个对比是否有这个id
   //             if(ResultBuf.getNumber(NumberFormat.UInt8LE, i) == id){
   //                 return true;
   //             }
   //         }
   //     }
   //     return false
   // }
    /**
     * TODO: 识别到的条形码的数据长度
     */
    //% weight=80 block="识别到的条形码的数据长度"
    //% subcategory=条形码识别
    export function LengthOfBarCodeData(): number {
        if(Current == Functions.BarcodeScan){
            return ResultBuf.getNumber(NumberFormat.UInt16LE, 0x20)
        }
        return 0
    }
    /**
     * TODO: 以字符串形式返回识别到的条形码的数据
     */
    //% weight=70 block="识别到的条形码数据字符串"
    //% subcategory=条形码识别
    export function StringFromBarCodeData(): string {
        if(Current == Functions.BarcodeScan){
            return ResultBuf.slice(0x30, LengthOfBarCodeData()).toString()
        }
        return ""
    } 
    /**
     * TODO: 以数组形式返回识别到的条形码的数据
     */
    //% weight=60 block="识别到的条形码数据数组"
    //% subcategory=条形码识别
    export function ArrayFromBarrCodeData(): Array<number> {
        if(Current == Functions.BarcodeScan){
            return ResultBuf.slice(0x30, LengthOfBarCodeData()).toArray(NumberFormat.UInt8LE)
        }
        return []
    }
}