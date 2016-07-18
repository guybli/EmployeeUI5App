sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessagePopover',
	'sap/m/MessagePopoverItem',
	'sap/ui/core/Fragment',
	'sap/ui/model/Filter'
], function(jQuery, Controller, JSONModel, MessagePopover, MessagePopoverItem, Fragment, Filter) {
	"use strict";

	var CControler = Controller.extend("aw.com.controller.Page", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf aw.com.view.view.Page
		 */

		onInit: function() {

			var oEmployee = new sap.ui.model.json.JSONModel();
			oEmployee.loadData("model/Employee.json");

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("model/Employees.json");

			this.getView().setModel(oModel);
			this.getView().setModel(oEmployee, "employee");

		},
		onPress: function(oEvent) {
			this.getSplitApp().to(this.createId("detail1"));

			var oEmployee = this.getView().getModel("employee");
			var oModel = this.getView().getModel();
			var oEmployees = oModel.getProperty("/EMPLOYEES");
			var oManager = new sap.ui.model.json.JSONModel();
			var oReports = new sap.ui.model.json.JSONModel();
			var oRepList = oEvent.getParameter("listItem").getBindingContext().getProperty("REPORTS");
			oManager.setData({
				"ID": "",
				"FNAME": "",
				"LNAME": "",
				"SEX": "",
				"TITLE": "",
				"COUNTRY": "",
				"PHONE": "",
				"EMAIL": "",
				"IMG_URL": ""
			});

			//	 

			oEmployee.setProperty("/ID", oEvent.getParameter("listItem").getBindingContext().getProperty("ID"));
			oEmployee.setProperty("/FNAME", oEvent.getParameter("listItem").getBindingContext().getProperty("FNAME"));
			oEmployee.setProperty("/LNAME", oEvent.getParameter("listItem").getBindingContext().getProperty("LNAME"));
			oEmployee.setProperty("/SEX", oEvent.getParameter("listItem").getBindingContext().getProperty("SEX"));
			oEmployee.setProperty("/TITLE", oEvent.getParameter("listItem").getBindingContext().getProperty("TITLE"));
			oEmployee.setProperty("/COUNTRY", oEvent.getParameter("listItem").getBindingContext().getProperty("COUNTRY"));
			oEmployee.setProperty("/PHONE", oEvent.getParameter("listItem").getBindingContext().getProperty("PHONE"));
			oEmployee.setProperty("/EMAIL", oEvent.getParameter("listItem").getBindingContext().getProperty("EMAIL"));
			oEmployee.setProperty("/IMG_URL", oEvent.getParameter("listItem").getBindingContext().getProperty("IMG_URL"));
			oEmployee.setProperty("/MANAGER",oEvent.getParameter("listItem").getBindingContext().getProperty("MANAGER"));


			this._loadManager(oManager, oEmployees, oEvent);
			this._loadReports(oReports, oEmployees, oEvent, oRepList);

			//window.alert("msg");

		},

		_loadManager: function(oManager, oEmployees, oEvent) {
			for (var i = 0; i < oEmployees.length; i++) {
				var tempEmp = oEmployees[i];

				if (tempEmp.ID === oEvent.getParameter("listItem").getBindingContext().getProperty("MANAGER").ID) {

					oManager.setProperty("/ID", tempEmp.ID);
					oManager.setProperty("/FNAME", tempEmp.FNAME);
					oManager.setProperty("/LNAME", tempEmp.LNAME);
					oManager.setProperty("/SEX", tempEmp.SEX);
					oManager.setProperty("/TITLE", tempEmp.TITLE);
					oManager.setProperty("/COUNTRY", tempEmp.COUNTRY);
					oManager.setProperty("/PHONE", tempEmp.PHONE);
					oManager.setProperty("/EMAIL", tempEmp.EMAIL);
					oManager.setProperty("/IMG_URL", tempEmp.IMG_URL);

					break;

				}
			}
			this.getView().setModel(oManager, "manager");

		},

		_loadReports: function(oReports, oEmployees, oEvent, oRepList) {
			var theList = [];
			for (var i = 0; i < oEmployees.length; i++) {
				var tempEmp = oEmployees[i];

				for (var k = 0; k < oRepList.length; k++) {
					var tempRep = oRepList[k];

					if (typeof tempRep != 'undefined' && tempEmp.ID === tempRep.ID) {
						var rep = {
<<<<<<< HEAD
							"REPORT": {
								"ID": "",
								"FNAME": "",
								"LNAME": "",
								"SEX": "",
								"TITLE": "",
								"COUNTRY": "",
								"PHONE": "",
								"EMAIL": "",
								"IMG_URL": ""
							}
						};

						rep.REPORT.ID = tempEmp.ID;
						rep.REPORT.FNAME = tempEmp.FNAME;
						rep.REPORT.LNAME = tempEmp.LNAME;
						rep.REPORT.SEX = tempEmp.SEX;
						rep.REPORT.TITLE = tempEmp.TITLE;
						rep.REPORT.COUNTRY = tempEmp.COUNTRY;
						rep.REPORT.PHONE = tempEmp.PHONE;
						rep.REPORT.EMAIL = tempEmp.EMAIL;
						rep.REPORT.IMG_URL = tempEmp.IMG_URL;

						theList.push(rep);

					}
				}

			}
			// oReports.setProperty("REPORTS",theList);
			oReports.setData({
				"REPORTS": theList
			});
			this.getView().setModel(oReports, "reports");

			// window.alert("I've set the Model");

		},

		_changeManager: function(oEmployee, oManager) {
			var oEmployees = this.getView().getModel().getProperty("/EMPLOYEES");
			for (var i = 0; i < oEmployees.length; i++) {
				var tempEmp = oEmployees[i];

				if (tempEmp.ID === oEmployee.getProperty("/ID")) {
					tempEmp.MANAGER.ID = oManager.getProperty("/ID");

					break;

				}
			}

		},

		onEdit: function() {
			//change the detail view to the edit employee detail fragment	

			this.getSplitApp().to(this.createId("editEmployee"));
		},
		onBack: function() {

			this.getSplitApp().to(this.createId("detail1"));

		},
		onChangeManager: function(oEvent) {

			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("popoverNavCon", "aw.com.view.ManagerSelect", this);
				this.getView().addDependent(this._oPopover);
			}

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function() {
				this._oPopover.setPlacement("Auto");
				this._oPopover.openBy(oButton);
			});

		},

		onSave: function(oEvent) {
			var oEmployee = this.getView().getModel("employee");
			var oManager = this.getView().getModel("manager");

			oEmployee.setProperty("/MANAGER/ID", oEvent.getParameter("listItem").getBindingContext().getProperty("ID"));

			oManager.setProperty("/ID", oEvent.getParameter("listItem").getBindingContext().getProperty("ID"));
			oManager.setProperty("/FNAME", oEvent.getParameter("listItem").getBindingContext().getProperty("FNAME"));
			oManager.setProperty("/LNAME", oEvent.getParameter("listItem").getBindingContext().getProperty("LNAME"));
			oManager.setProperty("/SEX", oEvent.getParameter("listItem").getBindingContext().getProperty("SEX"));
			oManager.setProperty("/TITLE", oEvent.getParameter("listItem").getBindingContext().getProperty("TITLE"));
			oManager.setProperty("/COUNTRY", oEvent.getParameter("listItem").getBindingContext().getProperty("COUNTRY"));
			oManager.setProperty("/PHONE", oEvent.getParameter("listItem").getBindingContext().getProperty("PHONE"));
			oManager.setProperty("/EMAIL", oEvent.getParameter("listItem").getBindingContext().getProperty("EMAIL"));
			oManager.setProperty("/IMG_URL", oEvent.getParameter("listItem").getBindingContext().getProperty("IMG_URL"));

			this._changeManager(oEmployee, oManager);
			
			this.onCancel(oEvent);

		},

		onCancel: function(oEvent) {
			this._oPopover.close();

=======
								"ID": "",
								"FNAME": "",
								"LNAME": "",
								"SEX": "",
								"TITLE": "",
								"COUNTRY": "",
								"PHONE": "",
								"EMAIL": "",
								"IMG_URL": ""
							
						};

						rep.ID = tempEmp.ID;
						rep.FNAME = tempEmp.FNAME;
						rep.LNAME = tempEmp.LNAME;
						rep.SEX = tempEmp.SEX;
						rep.TITLE = tempEmp.TITLE;
						rep.COUNTRY = tempEmp.COUNTRY;
						rep.PHONE = tempEmp.PHONE;
						rep.EMAIL = tempEmp.EMAIL;
						rep.IMG_URL = tempEmp.IMG_URL;

						theList.push(rep);

					}
				}

			}
			// oReports.setProperty("REPORTS",theList);
			oReports.setData({
				"REPORTS": theList
			});
			this.getView().setModel(oReports, "reports");
			this.byId("repList").setModel(oReports);
			
			var itemTemplate = new sap.m.StandardListItem({
              title:"{FNAME} {LNAME}", description:"{TITLE}",  icon:"{IMG_URL}",
              iconInset: true
          });
			
		    this.byId("repList").bindAggregation("items","/REPORTS" , itemTemplate);

			// window.alert("I've set the Model");

		},

		_changeManager: function(oEmployee, oManager) {
			var oEmployees = this.getView().getModel().getProperty("/EMPLOYEES");
			for (var i = 0; i < oEmployees.length; i++) {
				var tempEmp = oEmployees[i];

				if (tempEmp.ID === oEmployee.getProperty("/ID")) {
					tempEmp.MANAGER.ID = oManager.getProperty("/ID");

					break;

				}
			}

		},

		onEdit: function() {
			//change the detail view to the edit employee detail fragment	

			this.getSplitApp().to(this.createId("editEmployee"));
		},
		onBack: function() {

			this.getSplitApp().to(this.createId("detail1"));

		},
		onChangeManager: function(oEvent) {

			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("popoverNavCon", "aw.com.view.ManagerSelect", this);
				this.getView().addDependent(this._oPopover);
			}

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function() {
				this._oPopover.setPlacement("Auto");
				this._oPopover.openBy(oButton);
			});

		},

		onSave: function(oEvent) {
			var oEmployee = this.getView().getModel("employee");
			var oManager = this.getView().getModel("manager");

			oEmployee.setProperty("/MANAGER/ID", oEvent.getParameter("listItem").getBindingContext().getProperty("ID"));

			oManager.setProperty("/ID", oEvent.getParameter("listItem").getBindingContext().getProperty("ID"));
			oManager.setProperty("/FNAME", oEvent.getParameter("listItem").getBindingContext().getProperty("FNAME"));
			oManager.setProperty("/LNAME", oEvent.getParameter("listItem").getBindingContext().getProperty("LNAME"));
			oManager.setProperty("/SEX", oEvent.getParameter("listItem").getBindingContext().getProperty("SEX"));
			oManager.setProperty("/TITLE", oEvent.getParameter("listItem").getBindingContext().getProperty("TITLE"));
			oManager.setProperty("/COUNTRY", oEvent.getParameter("listItem").getBindingContext().getProperty("COUNTRY"));
			oManager.setProperty("/PHONE", oEvent.getParameter("listItem").getBindingContext().getProperty("PHONE"));
			oManager.setProperty("/EMAIL", oEvent.getParameter("listItem").getBindingContext().getProperty("EMAIL"));
			oManager.setProperty("/IMG_URL", oEvent.getParameter("listItem").getBindingContext().getProperty("IMG_URL"));

			this._changeManager(oEmployee, oManager);
			
			this.onCancel(oEvent);

		},

		onCancel: function(oEvent) {
			this._oPopover.close();

		},
		
		onShowReportDetail : function(oEvent){
				var oReport = new sap.ui.model.json.JSONModel();
			oReport.setData({
				"ID": "",
				"FNAME": "",
				"LNAME": "",
				"SEX": "",
				"TITLE": "",
				"COUNTRY": "",
				"PHONE": "",
				"EMAIL": "",
				"IMG_URL": ""
			});

			//	 

			oReport.setProperty("/ID", oEvent.getParameter("listItem").getBindingContext().getProperty("ID"));
			oReport.setProperty("/FNAME", oEvent.getParameter("listItem").getBindingContext().getProperty("FNAME"));
			oReport.setProperty("/LNAME", oEvent.getParameter("listItem").getBindingContext().getProperty("LNAME"));
			oReport.setProperty("/SEX", oEvent.getParameter("listItem").getBindingContext().getProperty("SEX"));
			oReport.setProperty("/TITLE", oEvent.getParameter("listItem").getBindingContext().getProperty("TITLE"));
			oReport.setProperty("/COUNTRY", oEvent.getParameter("listItem").getBindingContext().getProperty("COUNTRY"));
			oReport.setProperty("/PHONE", oEvent.getParameter("listItem").getBindingContext().getProperty("PHONE"));
			oReport.setProperty("/EMAIL", oEvent.getParameter("listItem").getBindingContext().getProperty("EMAIL"));
			oReport.setProperty("/IMG_URL", oEvent.getParameter("listItem").getBindingContext().getProperty("IMG_URL"));
			oReport.setProperty("/MANAGER",oEvent.getParameter("listItem").getBindingContext().getProperty("MANAGER"));
			
			this.getView().setModel(oReport, "report");
>>>>>>> branch 'master' of https://github.com/guybli/EmployeeUI5App
		},

		getSplitApp: function() {
			var result = this.byId("employeeApp");
			if (!result) {
				jQuery.sap.log.info("SplitApp object can't be found");
			}
			return result;

		}


	});

	return CControler;

});
