// 
//  contact.js
//  <project>
//  
//  Created by cuiab on 2016-11-24.
//  Copyright 2016 cuiab. All rights reserved.
// 

$(function($){
	
	function setS(key, value){
		sessionStorage.setItem(key, value);
//		localStorage.setItem(key, value);
	}
	
	function getS(key){
		return sessionStorage.getItem(key);
//		return localStorage.getItem(key);
	}
	
	//页面初始化之后，将storage里的数据显示出来
	var tableContact = $(".table-contact tbody"),
		formContact = $(".form-contact"),
		formInputs = formContact.find("input"),
		templateId = "contact-tr";
	
	var cacheName = "contact",
		cache = getS(cacheName);

	if(cache){
		var html = template(templateId, {list: JSON.parse(cache)} );
		tableContact.append( html );
	}
	
	tableContact.on("click", ".btn-delete", function(){
		
		var index = $(this).closest("tr").index();
		
		tableContact.children().eq( index ).remove();
		
		var cache = JSON.parse(getS(cacheName));
		for(var i = 0, len = cache.length; i < len; i++){
			if(index == i){
				cache.splice(i, 1);
				break;
			}
		}
		setS(cacheName, JSON.stringify(cache));

	}).on("click", ".btn-edit", function(){
		
		var tr = $(this).closest("tr");
		var index = tr.index();
		
		var tds = tr.children();
		
		$("[name=username]").val( tds[0].innerHTML );
		$("[name=telphone]").val( tds[1].innerHTML );
		$("[name=email]").val( tds[2].innerHTML );
		
		formContact.editedTr = tr;
		
	})
	
	//表单验证并保存
	formContact.formValidation({
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                	stringLength: {
                        enabled: false,
                        min: 4,
                        message: '姓名不能少于4位'
                    },
                    notEmpty: {
                        message: '姓名不能为空'
                    }
                }
            },
            telphone: {
                validators: {
                    notEmpty: {
                        message: '电话不能为空'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: '邮箱不能为空'
                    },
                    emailAddress: {
			        	message: '邮箱格式有误'
			        }
                }
            }
        }
    }).on('success.form.fv', function(e) {
    	//阻止默认提交事件
        e.preventDefault();

		//格式化数据
		var data = formContact.serialize(), obj = {};
		data.split("&").forEach(function(v){
			v = v.split("=");
			obj[ v[0] ] = decodeURIComponent( v[1] );
		})
		
		//使用模板编译tr节点
		var html = template(templateId, {list: [obj]});
		
		//如果当前是修改的tr，替换为新的tr节点
		if( formContact.editedTr ){
			formContact.editedTr[0].outerHTML = html;
			formContact.editedTr = null;
		} else {
			//在保存之前需要获取原来保存的，进行追加操作，而不是覆盖
			var cache = getS(cacheName);
			if(cache){
				cache = JSON.parse(cache);
				cache.push( obj );
				setS(cacheName, JSON.stringify(cache));
			}else{
				setS(cacheName, JSON.stringify([obj]));
			}
			tableContact.append( html );
		}
		
		//添加或者修改完成之后清空input
        formContact.formValidation('resetForm', true);
        formContact.formValidation('disableSubmitButtons', false);
        
    });
	
});