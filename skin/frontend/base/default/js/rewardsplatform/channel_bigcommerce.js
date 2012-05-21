console.log("file loaded");

var channel = {
    load : function(){


        stp.widget.newSlider()

        console.log("channel loaded");
/*
        getWidget.PointsBanner(function(injection){
            $("#container").append(
                "<div class='block'>"+
                injection
                +"</div>"
            );
        });

        getWidget.PointsSummary(this.getCustomerKey(), function(injection){
            $("#container").append(
                "<div class='block'>" +
                injection
                +"</div>"
            );
        });
*/
        getWidget.PointsSlider(this.getCustomerKey(),
            function(injection){
                $("#container").append(
                    "<div class='block'>"+
                    injection
                    +"</div>"
                );
            },

            function(value){
                //this ran when the customer releases the slider
                alert(value);
            },
            function(value){
                //this is ran when they slide, pretty optional if you don't have UI updating
                console.log(value);
            }
        );
    },

    getCustomerKey : function(){
        //Put in code that will put the channel specific customer id
        return 16;
    }
};
