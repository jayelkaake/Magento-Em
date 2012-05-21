//Each channel should be structure like this
//The load function is called to setup the neeed widgets

console.log("Channel Loaded");

stp.channel = {
    load : function(){



        console.log("loading banner");
        stp.widget.newBanner({
            injector : function(injection){
                $stp("#container").append(injection);
            }
        });

     

        console.log("loading slider");

        stp.widget.newSlider({
            customerKey : stp.channel.getCustomerKey(),
            onSlide     : function(value){
                console.log(value);
            },
            onRelease   : function(value){
                alert(value);
            },
            injector    : function(injection){
                $stp("#container").append(injection);
            }
        });
            


    },

    getCustomerKey : function(){
        //Put in code that will put the channel specific customer id
        return 16;
    }
};
