/*
*
*Isabela Draw 1.4 - A jquery library to draw on the web
*Copyright (C) 2008  Dirceu Barquette
*
*This program is free software: you can redistribute it and/or modify
*it under the terms of the GNU General Public License as published by
*the Free Software Foundation, either version 3 of the License, or
*(at your option) any later version.
*
*This program is distributed in the hope that it will be useful,
*but WITHOUT ANY WARRANTY; without even the implied warranty of
*MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*GNU General Public License for more details.
*
*You should have received a copy of the GNU General Public License
*along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*dirceu.barquette@gmail.com
*
*
*1.4 - news
*line method
*
*1.3 - news
*new engine when makes a block.
*no more limits to make boards!
*new feature: brush length
*
*1.2 - news
*new tutorial
*
*1.1.1 - bug fixed (thanks to Adriano Souza)
*overflow doesn't work in IE7. removed
*
*1.1 - bug fixed
*variables doesn't recognized in IE
*
*/

(function($) {
    $.fn.isabela_draw = function(options) {
        //debug(this);
        // build main options before element iteration
        var opts = $.extend({}, $.fn.isabela_draw.settings, options);
        // iterate and reformat each matched element
        return this.each(function() {
            $this = $(this);
            // build element specific options
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

            // call our format function
            isabela_new_draw = $.fn.isabela_draw.new_draw(o);
            $this.html(isabela_new_draw);
        });
    };
    //function debug($obj) {
    //    if (window.console && window.console.log)
    //        window.console.log($obj);
    //};
    function new_id() {
        var id = new Date();
        var ID = id.valueOf().toString();
        return ID;
    }
    var settings = {
        local:'body',
        position:{
            clientX:'',
            clientY:''
        },
        isabela_draw_block_css: {
            width:'100%',
            height:'300px',
            background:'#FFF'
        },
        isabela_draw_wrapper_css: {
            width:'100%',
            height:'300px',
            background:'#C7C7C7'
        },
        click_position: {
            clientX:'',
            clientY:''
        },
        cache: [],
        whattodoo: '',
        brush: {
            length:1,
            unit:'px'
        },
        in_action:false,
        block:{
            id:'',
            functional:''
        },
        color: '#000000',
        elements:[]
    };
    $.fn.isabela_draw.new_set = function (data) {
        $.each(data,function (k,v){
            settings[k] = v;
        });
        //console.log(settings);
    }
    $.fn.isabela_draw.new_draw = function (data) {
        //wrapper
        $('<div></div>')
        .attr({id:'isabela_draw_wrapper'})
        .addClass('isabela_draw_wrapper')
        .css(settings.isabela_draw_wrapper_css)
        .bind('click',function (e){
            if (!$('.isabela_draw_board').attr('id')) {
                var str = settings.whattodoo+"(settings);";
                eval(str);
            }
        })
        .appendTo(data.local);
        $.fn.isabela_draw.new_set({local:data.local});
    }
    //wait
    function map(data) {  
        var l = $(settings.elements).length;
        var Id = 'cel-'+new_id();
        settings.elements[l] = data;
        return settings.elements[l];
    }
    //not working...
    function pixel (Id,posX,posY,_css,_attr,_addClass) {
        var _Css = _css || {};
        var _Attr = _attr || {};
        var _AddClass = _addClass || {};
        if (!$('#'+Id).hasClass('layer-1')) {
            obj= map({id:Id,X:posX,Y:posY});
            $('<div></div>')
            .attr({id:Id})
            //.css({position:'absolute',left:posX,top:posY,width:'1px',height:'1px'})
            .css({position:'absolute'})
            .css(_css)
            .addClass('layer-1')
        } else {
            $('#'+Id).attr(_Attr).addClass(_AddClass).css(_Css);
        }
        //return $('#'+Id).attr('id');
        return Id;
    }

    var isabela_draw_erase = function (s) {
        $.fn.isabela_draw.new_set({in_action:true});
        $('.layer-1').bind('mousemove',function(e){
            $(this).remove();
        })
    }
    var pencil_drawing = function (s) {
        $.fn.isabela_draw.new_set({in_action:true});
        $('.isabela_draw_board')
        .bind('mousemove',function(e){
            relX = e.clientX - s.position.clientX;
            relY = e.clientY - s.position.clientY;
            absX = relX + s.position.clientX;
            absY = relY + s.position.clientY;
            Id = 'cel-'+relX+'-'+relY;
            var unit = s.brush.length+s.brush.unit;
            if (!$('#'+Id).hasClass('layer-1')) {
                obj= map({id:Id,X:relX,Y:relY});
                $('<div></div>')
                .attr({id:Id})
                .css({position:'absolute',left:absX,top:absY,width:unit,height:unit,background:s.color})
                .addClass('layer-1')
                .appendTo(this);
            }
        })
    }
    function cache(data) {  
        var l = $(settings.elements).length;
        settings.cache[l] = data;
    }
    function clear_cache () {
        settings.cache = [];
    }    
    var isabela_draw_line = function (s) {
        $.fn.isabela_draw.new_set({in_action:true});
        clear_cache();
        $('.isabela_draw_board')
        .bind('mousemove',function(e){
            relX = e.clientX - s.position.clientX;
            relY = e.clientY - s.position.clientY;
            absX = relX + s.position.clientX;
            absY = relY + s.position.clientY;
            //Id = 'cache-'+relX+'-'+relY;
            var unit = s.brush.length+s.brush.unit;
            $(settings.cache).each(function(){
                //console.log(this);
                $('#'+this.id).remove();
            });
            clear_cache();
            var coords = line(settings.click_position.clientX,settings.click_position.clientY,absX,absY);
            var str;
            jQuery.each(coords,function(k,v){
                str = 'cel-'+v.X+'-'+v.Y;
                cache({id:str});
                obj= map({id:str,X:v.X,Y:v.Y});
                $('<div></div>')
                .attr({id:str})
                .css({position:'absolute',left:v.X,top:v.Y,width:unit,height:unit})
                .addClass('selected_to_draw_line')
                .bind('click',function(e){
                    $('.selected_to_draw_line').css({background:s.color,'z-index':0})
                    .addClass('layer-1');
                    $('.layer-1').removeClass('selected_to_draw_line');
                }).appendTo('.isabela_draw_board');
            })
            $('#isabela_draw_loading').css({display:'none'})
        })
    }
    
    var isabela_draw_circle = function (s) {
        $.fn.isabela_draw.new_set({in_action:true});
        $('.isabela_draw_board')
        .bind('mousemove',function(e){
            relX = e.clientX - s.position.clientX;
            relY = e.clientY - s.position.clientY;
            absX = relX + s.position.clientX;
            absY = relY + s.position.clientY;
            Id = 'cel-'+relX+'-'+relY;
            var unit = s.brush.length+s.brush.unit;
            var radius = 
            $('.selected_to_draw_circle').each(function(){$(this).removeClass();})
            var octants = circle(settings.click_position.clientX,settings.click_position.clientY,absX);
            var str = '';
            jQuery.each(octants,function(k,v){
                str = 'cel-'+v.X+'-'+v.Y;
                if (!$('#'+str).hasClass('layer-1')) {
                    obj= map({id:str,X:v.X,Y:v.Y});
                    $('<div></div>')
                    .attr({id:str})
                    .css({position:'absolute',left:v.X,top:v.Y,width:unit,height:unit})
                    .addClass('layer-1 selected_to_draw_circle')
                    .bind('click',function(e){
                        $('.selected_to_draw_circle').css({background:s.color});
                    })
                    .appendTo('.isabela_draw_board');
                }
            })
        })
    }
    var circle = function (x,y,radius) {
        var discriminant = (5 - radius<<2)>>2;
        var i = 0, j = radius,octant = [];
        while (i<=j) {
            octant[0] = {X:x+i,Y:y-j};
            octant[1] = {X:x+j,Y:y-i};
            octant[2] = {X:x+i,Y:y+j};
            octant[3] = {X:x+j,Y:y+i};
            octant[4] = {X:x-i,Y:y-j};
            octant[5] = {X:x-j,Y:y-i};
            octant[6] = {X:x-i,Y:y+j};
            octant[7] = {X:x-j,Y:y+i};
            i++ ;
            if (discriminant<0) {                
                discriminant += (i<<1) + 1 ;
            } else {
                j-- ;
                discriminant += (1 + i - j)<<1 ;
            }
        }
        return octant;
    }
    var line = function(x,y,x2,y2) {
        var w = x2 - x ;
        var h = y2 - y ;
        var dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0 ;
        if (w<0) dx1 = -1 ; else if (w>0) dx1 = 1 ;
        if (h<0) dy1 = -1 ; else if (h>0) dy1 = 1 ;
        if (w<0) dx2 = -1 ; else if (w>0) dx2 = 1 ;
        var longest = Math.abs(w) ;
        var shortest = Math.abs(h) ;
        if (!(longest>shortest)) {
            longest = Math.abs(h) ;
            shortest = Math.abs(w) ;
            if (h<0) dy2 = -1 ; else if (h>0) dy2 = 1 ;
            dx2 = 0 ;            
        }
        var numerator = longest >> 1 ;
        var pixels = [];
        for (i=0;i<=longest;i++) {
            //putpixel(x,y,color) ;
            pixels[i] = {X:x,Y:y}
            numerator += shortest ;
            if (!(numerator<longest)) {
                numerator -= longest ;
                x += dx1 ;
                y += dy1 ;
            } else {
                x += dx2 ;
                y += dy2 ;
            }
        }
        return pixels;
    }
    var new_block = function (s) {
        $('#isabela_draw_wrapper').empty();
        $('#isabela_draw_wrapper').unbind('click');
        var ID = 'isabela_draw_board-'+new_id();
        var userData =
            {coords:[],
                unit:1,
                stepX:1,
                stepY:1,
                dims:{w:128,h:128}
            };        
        $('<div></div>').attr({id:ID}).addClass('isabela_draw_board')
        .css(settings.isabela_draw_block_css)
        .bind('click',function(e){
             if (!settings.in_action) {
                $.fn.isabela_draw.new_set({in_action:true,click_position:{'clientX':e.clientX,'clientY':e.clientY}});
                var str = settings.whattodoo+"(settings);";
                eval(str);
             } else {
                $.fn.isabela_draw.new_set({in_action:false});
                $('.isabela_draw_board').unbind('mousemove');
             }
        })
        .appendTo('#isabela_draw_wrapper');
        var pos = $('#'+ID).position();
        $.fn.isabela_draw.new_set({position:{clientX:pos.left,clientY:pos.top}});
    }
    $.fn.isabela_draw.empty = function (data) {
        $('#isabela_draw_wrapper').empty();
    }

})(jQuery);