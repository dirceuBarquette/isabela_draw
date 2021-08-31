/*
*
*Isabela Draw 1.2 - A jquery library to draw on the web
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

            // call function
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
        whattodoo: '',
        in_action:false,
        block:{
            id:'',
            functional:''
        },
        color: '#000000',
        elements:[]
    };
    function map(data) {  
        var l = $(settings.elements).length;
        var Id = 'cel-'+new_id();
        settings.elements[l] = data;
        //if (l == 10) {console.log(settings.elements)}
        return settings.elements[l];
    }
    function whattodoo (settings){
        switch (settings.whattodoo) {
            case 'new_block' :
                new_block(settings);
                break
            case 'pencil_drawing' :
                pencil_drawing(settings);
                break;
        }
    };
    $.fn.isabela_draw.new_set = function (data) {
        $.each(data,function (k,v){
            settings[k] = v;
        })   
    }    
    $.fn.isabela_draw.new_draw = function (data) {
        //wrapper
        var Id,posX,posY;
        $('<div id="isabela_draw_wrapper" class="isabela_draw_wrapper"></div>')
        .bind('mousemove',function(e){
            posX = e.clientX;
            posY = e.clientY;
            Id = 'cel-'+posX+'-'+posY;
            if (!$('#'+Id).hasClass('layer-1')) {
                obj= map({id:Id,X:posX,Y:posY});
                $('<div></div>')
                .attr({id:Id})
                .css({position:'absolute',left:posX,top:posY,width:'1px',height:'1px'})//,background:'blue'
                .addClass('layer-1')
                .appendTo(this);
            }
        })
        .appendTo(data.local);
    
        $.fn.isabela_draw.new_set({local:data.local});
        $('.isabela_draw_wrapper').bind('click',function(e){
             if (settings.whattodoo != '') {
                whattodoo(settings);
             } else {
                if (settings.in_action) {
                    $.fn.isabela_draw.new_set({in_action:false});
                } else {
                    alert('Select an action first!');
                }
             }
        })
    }
    
    //WHATTODOOS
    var pencil_drawing = function (s) {
        $.fn.isabela_draw.new_set({in_action:true});
        $('.isabela_draw_cel').each(function(){
            $(this).bind('mouseover',function(e){
                $(this).css({background:s.color});
            })
            .bind('click',function(e){//alert('alert do drawing')
                $('.isabela_draw_board > *').each(function() {
                    $(this).unbind('mouseover').unbind('click');
                })
                $.fn.isabela_draw.new_set({whattodoo:''});
            })
        });
    }
    
    var new_block = function (s) {
        var ID = new_id();
        //clearing border
        $('.isabela_draw_board').removeClass('isabela_draw_add_border');
        
        $('<div id="isabela_draw_board-'+ID+'" class="isabela_draw_board"></div>')
        .appendTo('#isabela_draw_wrapper');
        var userData =
            {coords:[],
                unit:1,
                stepX:1,
                stepY:1,
                dims:{w:32,h:32}
            };
        $('.isabela_draw_board')
        .css({width:userData.dims.w+'px',height:userData.dims.h+'px',background:'#FFF'})
        .bind('hover',function(){$(this).addClass('isabela_draw_add_border');},function(){$(this).removeClass('isabela_draw_add_border');})
        
        var units_per_row = userData.dims.w / userData.stepX;
        var units_per_col = userData.dims.h / userData.stepY;
        var total_units = units_per_row * units_per_col;
        var htm = '';
        
        for (i = 0;i < total_units;i += userData.unit) {
            htm += '<div class="isabela_draw_cel" style="width:'+userData.stepX+'px;height:'+userData.stepY+'px"></div>';
        }
        $(htm).appendTo('#isabela_draw_board-'+ID);
    }
    $.fn.isabela_draw.empty = function (data) {
        $('#isabela_draw_wrapper').empty();
    }

})(jQuery);