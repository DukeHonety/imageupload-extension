 /**
 * 
 * Content script allowing page to invoke api and call native methods on exposed interface
 * 
 * Self Invoking Functions
 * 
 * 
 */
 
  
var __SCAN__API = (function () {

    function post(message, callback) {
		//console.log('scanAPI: post',message, callback); 
        var event = new CustomEvent("PassToBackground", { detail: message });
        window.addEventListener(message.method, callback, false);
        window.dispatchEvent(event);
    }

    function getFile(message, callback) {
		//console.log('scanAPI: GetFile',message, callback); 
        var event = new CustomEvent("GetFile", { detail: message });
        window.addEventListener(message.method, callback, false);
        window.dispatchEvent(event);
    }

    function __twp_getSupportedCaps(callback) {
        post({
            method: "__twp_getSupportedCaps",
        }, callback);
    }

    function __twp_getImage(pageIndex, callback) {
        post({
            method: "__twp_getImage",
            ScanPrm: pageIndex,
            appName: "JS Scan"
        }, callback);
    }

    function __twp_uploadPdf(script, callback) {
        post({
            method: "__twp_uploadPdf",
            ScanPrm: script,
            appName: "JS Scan"
        }, callback);
    }

    function __twp_loadPdf(pdfPrm, callback) {
        post({
            method: "__twp_loadPdf",
            ScanPrm: pdfPrm,
            appName: "JS Scan"
        }, callback);
    }

    function __twp_selectScanner(appName, callback) {
		//console.log('scapAPI: twp_selectScanner',appName, callback);
        if (!appName) {
            appName = "JS Scan";
        }
        post({
            method: "__twp_selectScanner",
            appName: appName
        }, callback);
    }

    function __twp_simpleScan(Path, scanPrm, appName, callback) {
        if (!appName) {
            appName = "JS Scan";
        } 
        post({
            method: "__twp_simpleScan",
			ImgPath: Path, 
            ScanPrm: scanPrm,
            appName: appName
        }, callback);
    }

    function __twp_createPdf(Path, scanPrm, appName, callback) {
        if (!appName) {
            appName = "JS Scan";
        } 
        post({
            method: "__twp_createPdf",
			ImgPath: Path, 
            ScanPrm: scanPrm,
            appName: appName
        }, callback);
    }
	
	function __twp_uploadFile(fileurl, filename,filetype,callback){
		  post({
             method: "__twp_uploadFile",              
			 filename: filename,
			 filetype: filetype,
			 fileurl: fileurl
         }, callback);
		  
	}
	
	function __twp_reOrderPDF(fromPage,toPage,noOfPages,callback){
		  post({
             method: "__twp_reOrderPDF",              
			 fromPage: fromPage,
			 toPage: toPage ,
			 noOfPages: noOfPages 
         }, callback);
		  
	}
	
	function __twp_removePDFPages(fromPage,noOfPages,callback){
		  post({
             method: "__twp_removePDFPages",              
			 fromPage: fromPage, 
			 noOfPages: noOfPages 
         }, callback);
		  
	}
	
	function __twp_resetOutput(callback){
		  post({
             method: "__twp_resetOutput" 
         }, callback);
		  
	}
	
	 function __twp_mergePdf( filedata,appName, callback) {
        if (!appName) {
            appName = "JS Scan";
        } 
		  
		 //file: formData,
        post({
            method: "__twp_mergePdf", 
            appName: appName
        }, callback);
    }

    function __twp_scanToPdf(PdfFilePath, appName, maxPages, Flags, callback) {
        if (!appName) {
            appName = "JS Scan";
        }
        post({
            method: "__twp_scanToPdf",
            PdfFilePath: PdfFilePath,
            appName: appName,
            maxPages: maxPages,
            Flags: Flags,
        }, callback);
    }

    //general function call 
    function __twp_resample(scanPrm, callback) {
        post({
            method: "__twp_resample",
            ScanPrm: scanPrm,
        }, callback);
    }

	function __twp_scanUpdate( callback) {
        post({
            method: "__twp_scanUpdate",
            detail: '',
        }, callback);
    }
	
	function __twp_executeQuery(servername,dbname, authtype, username,passwd,strQry, callback) {
        post({
            method: "__twp_executeQuery",
			servername: servername,
            dbname : dbname,
			authtype : authtype,
			username : username,
			passwd : passwd,
			strQry : strQry
        }, callback);
    }


    function __twp_downloadFile(filename, chunksize, callback) {
        getFile({
            method: "__twp_downloadFile",
            filename: filename,
            chunksize : chunksize
        }, callback);
    }

    /**
     * return all public methods and fields to be used
     */
    return {

        /**
         * Get main supported capabilities 
         * (like brightness, pixel type, etc)
         * list of supported resolutions and pixel types.
         * 
         */
        twp_getSupportedCaps: __twp_getSupportedCaps,

        /**
         * It can be used to change values before scan without dialog
         * Use SPC_** constants as capType
         * For Brightness and Contrast values range is -1000:1000
         * For resolution value should be taken from supported values (resolutions[] array) 
         * For pixel type use PXT_** constants (only supported should be used)
         * @param {*} capType SPC_** constant
         * @param {*} capValue 
         * no return value
         */
        twp_selectScanner: __twp_selectScanner,

        /**
         * 
         * @param {*} Flags 
         * @param {*} appName 
         */
        twp_simpleScan: __twp_simpleScan,
        twp_createPdf: __twp_createPdf,
		 twp_mergePdf: __twp_mergePdf,
        twp_getImage: __twp_getImage,
        twp_uploadPdf: __twp_uploadPdf,
		twp_loadPdf: __twp_loadPdf,
        twp_scanToPdf: __twp_scanToPdf,
        twp_resample: __twp_resample,
		twp_uploadFile : __twp_uploadFile,
		twp_reOrderPDF : __twp_reOrderPDF,
		twp_resetOutput : __twp_resetOutput,
		twp_scanUpdate : __twp_scanUpdate,
		twp_removePDFPages : __twp_removePDFPages,
        twp_executeQuery : __twp_executeQuery,
        twp_downloadFile : __twp_downloadFile,
		

        SIF_DIALOG: 0x0000,
        SIF_PROGRESS_ONLY: 0x0001,
        SIF_NO_UI: 0x0002,

        SIF_DIB: 0x0004,
        SIF_BMP: 0x0000,

        MAX_RESOLUTIONS: 10,
        CAPS_NUM: 5,

        /**
         * Should be -1000:1000
         */
        SPC_BRIGHTNESS: 0x0001,
        /**
         *  -1000:1000 
         * */
        SPC_CONTRAST: 0x0002,
        /**
         * PXT_ constants
         */
        SPC_PIXELTYPE: 0x0004,

        /**
         * Value from resolutions[]
         */
        SPC_RESOLUTION: 0x0008,

        /**
         * 0 or 1
         */
        SPC_DUPLEX: 0x0010,

        PXT_BW: 0x0001,
        PXT_GRAY: 0x0002,
        PXT_COLOR: 0x0004, 
        PXT_PALETTE: 0x0008,

    };

})();







