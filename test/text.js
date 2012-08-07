$(function () {

   $.support.transition = false;
   var fx = $('#async-fixture');
    
    module("text")
      
     test("input should contain '' if element is empty", function () {
        var e = $('<a href="#"></a>').appendTo('#qunit-fixture').editable();
        e.click();
        var p = e.data('popover').$tip;
        ok(!p.find('input[type=text]').val().length, 'input val is empty')
        p.find('button[type=button]').click(); 
        ok(!p.is(':visible'), 'popover was removed')    
      })   
      
     test("toggle by another element (string)", function () {
        var e = $('<a href="#"></a>').appendTo('#qunit-fixture').editable({
            toggle: '<i class="icon-pencil"></i>'
        }),
        t = e.siblings('.icon-pencil');
        
        ok(t.length, 'additional element shown');
        t.click();
        var p = e.data('popover').$tip;
        ok(p.is(':visible'), 'popover visible');
        t.click();
        ok(!p.is(':visible'), 'popover was removed');
        e.click(); 
        var p = e.data('popover').$tip;
        ok(!p.is(':visible'), 'popover not shown by click on elem itself');
     })    
     
     test("toggle by another element (id)", function () {
        var t = $('<span id="pencil" class="icon-pencil">qwe</span>').appendTo('#qunit-fixture'),
            e = $('<a href="#" data-toggle="#pencil"></a>').appendTo('#qunit-fixture').wrap('<div>').editable({});
        
        ok(!e.siblings('.icon-pencil').length, 'element not added as already exists');
        t.click();
        var p = e.data('popover').$tip;
        ok(p.is(':visible'), 'popover visible');
        t.click();
        ok(!p.is(':visible'), 'popover was removed') 
     })        
     
     asyncTest("should load correct value and save new entered text (and value)", function () {
        var  v = 'ab<b>"',
             esc_v = $('<div>').text(v).html(),
             e = $('<a href="#" data-pk="1" data-url="post.php">'+esc_v+'</a>').appendTo(fx).editable({
             success: function(data) {
                 return false;
             } 
          }),  
          newText = 'cd<e>;"'

        e.click()
        var p = e.data('popover').$tip;
        ok(p.is(':visible'), 'popover visible')
        ok(p.find('.editable-loading').length, 'loading class exists')
        ok(!p.find('.editable-loading').is(':visible'), 'loading class is hidden')
        ok(p.find('input[type=text]').length, 'input exists')
        equal(p.find('input[type=text]').val(), v, 'input contain correct value')
        p.find('input').val(newText);
        p.find('button[type=submit]').click(); 
        ok(p.find('.editable-loading').is(':visible'), 'loading class is visible');
        
        setTimeout(function() {
           ok(!p.is(':visible'), 'popover closed')
           equal(e.data('editable').value, newText, 'new text saved to value')
           equal(e.text(), newText, 'new text shown') 
           e.remove();    
           start();  
        }, timeout);                     
      })     
      
     asyncTest("should load correct value and save new entered text (pk defined as #id)", function () {
        var e = $('<a href="#" data-pk="#pk" data-url="post.php">abc</a>').appendTo(fx).editable({}),  
          t = $('<span id="pk">123</span>'),
          newText = 'cd<e>;"'

        e.click()
        var p = e.data('popover').$tip;
        ok(p.is(':visible'), 'popover visible')
        ok(p.find('input[type=text]').length, 'input exists')
        equal(p.find('input[type=text]').val(), 'abc' , 'input contain correct value')
        p.find('input').val(newText);
        p.find('button[type=submit]').click(); 
        ok(p.find('.editable-loading').is(':visible'), 'loading class is visible');
        
        setTimeout(function() {
           ok(!p.is(':visible'), 'popover closed')
           equal(e.data('editable').value, newText, 'new text saved to value')
           equal(e.text(), newText, 'new text shown') 
           e.remove();    
           start();  
        }, timeout);                     
      })       
      
     asyncTest("should show error on validation", function () {
        var e = $('<a href="#">abc</a>').appendTo(fx).editable({
              validate: function(value) { if(value == '') return 'required'; }
          }),
          newText = '';

        e.click();
        var p = e.data('popover').$tip; 
        ok(p.is(':visible'), 'popover shown');
        p.find('input').val(newText);
        p.find('form').submit(); 
        
        setTimeout(function() {
           ok(p.is(':visible'), 'popover still shown');  
           ok(p.find('.error').length, 'class "error" exists');
           equal(p.find('.help-block').text(), 'required', 'error msg shown');   
           p.find('button[type=button]').click(); 
           ok(!p.is(':visible'), 'popover was removed');
           e.remove();    
           start();   
        }, timeout);                     
     })      
     
     test("test validation map", function () {
        var e = $('<a href="#" class="map" data-name="e">abc</a>').appendTo('#qunit-fixture'),
            e1 = $('<a href="#" class="map" data-name="e1">abc</a>').appendTo('#qunit-fixture'),
            newText = '';
            
            $('.map').editable({
                validate: {
                    e: function(value) { if(value == '') return 'required1'; 
                    },
                    e1:function(value) { if(value == '') return 'required2'; 
                    },
                    e2: 'qwerty' //this should not throw error  
                }
            });
         

        e.click();
        var p = e.data('popover').$tip;
        p.find('input').val(newText);
        p.find('form').submit(); 
        ok(p.is(':visible'), 'popover still shown');  
        ok(p.find('.error').length, 'class "error" exists');
        equal(p.find('.help-block').text(), 'required1', 'error msg shown');   
        p.find('button[type=button]').click(); 
        ok(!p.is(':visible'), 'popover was removed');
        
        e = e1;
        e.click();
        var p = e.data('popover').$tip;
        p.find('input').val(newText);
        p.find('form').submit(); 
        ok(p.is(':visible'), 'popover still shown');  
        ok(p.find('.error').length, 'class "error" exists');
        equal(p.find('.help-block').text(), 'required2', 'error msg shown');   
        p.find('button[type=button]').click(); 
        ok(!p.is(':visible'), 'popover was removed');        
     })        
      
     asyncTest("should show error if success callback return string", function () {
        var e = $('<a href="#" data-pk="1" data-url="post.php">abc</a>').appendTo(fx).editable({
             success: function(data) {
                 return 'error';
             } 
          }),  
          newText = 'cd<e>;"'

        e.click()
        var p = e.data('popover').$tip;

        ok(p.find('input[type=text]').length, 'input exists')
        p.find('input').val(newText);
        p.find('form').submit(); 
        
        setTimeout(function() {
           ok(p.is(':visible'), 'popover still shown');  
           ok(p.find('.error').length, 'class "error" exists');
           equal(p.find('.help-block').text(), 'error', 'error msg shown');   
           p.find('button[type=button]').click(); 
           ok(!p.is(':visible'), 'popover was removed');
           e.remove();    
           start();  
        }, timeout);             
        
      })   
   
      asyncTest("should submit all required params", function () {
        var e = $('<a href="#" data-pk="1" data-url="post-resp.php">abc</a>').appendTo(fx).editable({
             name: 'username',
             params: {
                q: 2 
             },
             success: function(resp) {   
                 equal(resp.dataType, 'json', 'dataType ok');
                 equal(resp.data.pk, 1, 'pk ok');
                 equal(resp.data.name, 'username', 'name ok');
                 equal(resp.data.value, newText, 'value ok');
                 equal(resp.data.q, 2, 'additional params ok');
             } 
          }),  
          newText = 'cd<e>;"'

        e.click()
        var p = e.data('popover').$tip;

        ok(p.find('input[type=text]').length, 'input exists')
        p.find('input').val(newText);
        p.find('form').submit(); 
        
        setTimeout(function() {
           e.remove();    
           start();  
        }, timeout);             
        
      })              
     
     asyncTest("should show emptytext if entered text is empty", function () {
            var emptytext = 'blabla',
                e = $('<a href="#" data-pk="1" data-url="post.php" data-emptytext="'+emptytext+'">abc</a>').appendTo(fx).editable(),
                newText = '';

            e.click()
            var p = e.data('popover').$tip;
            ok(p.find('input').length, 'input exists')
            p.find('input').val(newText);
            p.find('form').submit(); 
            
            setTimeout(function() {
               ok(!p.is(':visible'), 'popover closed')
               equal(e.data('editable').value, newText, 'value is empty')
               equal(e.text(), emptytext, 'emptytext shown')                 
               e.remove();    
               start();  
            }, timeout);            
      })  
       
     asyncTest("should show error when server-side error", function () {
            var e = $('<a href="#" data-pk="1">abc</a>').appendTo(fx).editable({
              url: 'error.php',
              error: function(xhr) {
                  if(xhr.status == 500) return 'Internal server error';
              }  
            }),
            newText = 'cde';

            e.click()
            var p = e.data('popover').$tip;
            ok(p.find('input').length, 'input exists')
            p.find('input').val(newText);
            p.find('form').submit(); 
            
            setTimeout(function() {
               ok(p.is(':visible'), 'popover visible')
               ok(p.find('.error').length, 'class "error" exists')
               equal(p.find('.help-block').text(), 'Internal server error', 'error shown')               
               
               p.find('button[type=button]').click(); 
               ok(!p.is(':visible'), 'popover was removed')
               
               e.remove();  
               start();  
            }, timeout);    
      })                            

     test("if pk = null --> should save new entered text and value, but no ajax", function () {
            var e = $('<a href="#">abc</a>').appendTo('#qunit-fixture').editable({
              send: 'ifpk'
            }),
            newText = 'cde';

            e.click()
            var p = e.data('popover').$tip;
            ok(p.find('input').length, 'input exists')
            p.find('input').val(newText);
            p.find('form').submit(); 
            
            ok(!p.is(':visible'), 'popover was removed')
            equal(e.data('editable').value, newText, 'new text saved to value')
            equal(e.text(), newText, 'new text shown')
            ok(e.hasClass('editable-changed'), 'has class editable-changed')
      });
         
})    