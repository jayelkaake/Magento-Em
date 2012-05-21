//Needs to be included with stp_base.js
stp.obj = {
    newSpinner : function(){
        var spinnerCode = "";
        var queue = [];

        //give each function in the it's image code
        var flushQueue = function(){
            for(var i = 0; i < queue.length; i++){
                if(typeof queue[i] === 'function'){
                    queue[i](spinnerCode);
                }
            }
        };

        var spinner = {};

        spinner.getImage = function(callback){
            if(spinnerCode === ""){
                queue.push(callback);
            }else{
                callback(spinnerCode);
            }
        };

        spinner.hide = function(spinnerId){
            $stp("#" + spinnerId).hide();
        };

        //Call the spinner image down from the servers
        stp.ajax(stpData.apiUrl + "/asset?image=spinner&base64=true", function(data){ //switch to spinner later
            console.log("Loaded spinner");
            spinnerCode = 'data:image/png;base64,'+ data;
            flushQueue(); 
        }); 

        return spinner;
    },

    newWidget : function(){

        var loadSpinner = function(){
            stp.spinner.getImage(function(image){
                stpData.widget[widget.id].spinner = new Image();
                stpData.widget[widget.id].spinner.id = widget.id + "_spinner";
                stpData.widget[widget.id].spinner.src = image;

                widget.injector(stpData.widget[widget.id].spinner);
            });
        };

        var widget = {};
        
        widget.builder = null;
        widget.injector = null;
        
        widget.create = function(assetsNeeded){
            widget.id = stp.utils.getNextWidgetId();
            stpData.widget[widget.id] = {};
            loadSpinner(); 
            
            if(typeof widget.builder === 'function'){
                stp.obj.startAssemblyline(assetsNeeded, widget.builder);
            }else{
                console.log("ERROR: Extend the builder method of the widget");
            }
        };

        widget.inject = function(args){
            if(typeof widget.injector === 'function'){

                stp.spinner.hide(stpData.widget[widget.id].spinner.id);

                args.template["stp_widgetid"] = widget.id; //augment the template to include the widget's id
                widget.injector(Mustache.render(args.widget, args.template));

                if(typeof stpData.widget[widget.id].load === 'function'){
                    stpData.widget[widget.id].load();
                }               
            }else{
                console.log("ERROR: Extend the injector function of the widget");
            }
        };
             
        return widget;
    },

    startAssemblyline : function(components, callback){
        var workers = new Array();
        var assemblyline = {};
        
        var reportBack = function(){
            var allComplete = true;
            for(var i = 0; i < workers.length ; i++){
                var worker = workers[i];
                if(!worker.complete){
                    allComplete = false;
                }else{
                    assemblyline[worker.name] = worker.payload;
                }
            }
            if(allComplete){
                callback(assemblyline);
            }
        }
        
        //TODO: Get better names for components
        var createWorkers = function(){
            for(component in components){
                if(components.hasOwnProperty(component)){
                    workers.push(stp.obj.newWorker({
                        name : component, 
                        path : components[component], 
                        callback : reportBack
                    }));
                }
            }
        };
        
        var startWorkers = function(){
            for(var i = 0; i < workers.length ; i++){
                workers[i].run();
            }
        }
        
        //Init
        createWorkers();
        startWorkers();
    },

    newWorker : function(args){
        var worker = {};
        
        worker.complete = false;
        worker.name = args.name;
        worker.path = args.path;
        
        var collectPayload = function(payload){
            worker.complete = true;
            worker.payload = payload;
            args.callback(worker);
        }
        
        worker.run = function(){
            stp.switchboard.makeCall(worker.path, collectPayload);
        }
        return worker;
    },

    newSwitchboard : function(){
        var queue = {};
        
        var returnedRequest = function(request){
            for(var i = 0; i < queue[request.path].length; i++){
                if(typeof queue[request.path][i] === 'function'){
                    queue[request.path][i](request.data);
                }
            }
            switchboard.cache[request.path] = request.data;
        };
        
        var switchboard = {};
        switchboard.cache = {};
        
        switchboard.makeCall = function(path, callback){    
            var result;
            if(switchboard.cache.hasOwnProperty(path) && typeof callback === 'function'){
                callback(switchboard.cache[path]);
            } else if(queue.hasOwnProperty(path)){
                queue[path].push(callback);
            } else {
                queue[path] = new Array();
                queue[path].push(callback);
                stp.obj.startAssetRequest(path, returnedRequest);
            }
        }
        return switchboard;
    },

    startAssetRequest : function(path, returnRequest){
        var request = {};   
        request.path = path;
        var ajaxFeedback = function(data){
            request.data = data;
            returnRequest(request);
        }
        stp.ajax(stpData.apiUrl + path, ajaxFeedback);
    }

};