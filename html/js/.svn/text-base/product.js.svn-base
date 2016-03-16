/**
 * Created by Administrator on 2016/2/3.
 */
$(function(){
    $("#pro-menu .pro-menu-btn").click(function(){
        var index=$(this).index();
        $("#pro-menu .pro-menu-btn").removeClass("active");
        $("#pro-menu .pro-menu-btn2").removeClass("active");
        $(this).addClass("active");
        $("#pro-content").find(".container").hide();
        $("#pro-content2").find(".container").hide();
        $("#pro-content").find(".container").eq(index).fadeIn(1000);
        /*var val_name=$(this).find("p").text();
        $(".company-name").text(val_name);*/
    });

    $("#pro-menu .pro-menu-btn2").click(function(){
        var index=$(this).index();
        $("#pro-menu .pro-menu-btn2").removeClass("active");
        $("#pro-menu .pro-menu-btn").removeClass("active");
        $(this).addClass("active");
        $("#pro-content").find(".container").hide();
        $("#pro-content2").find(".container").hide();
        $("#pro-content2").find(".container").eq(index).fadeIn(1000);

    });
})