sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/VBox",
	"sap/m/Text",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, VBox, Text, MessageToast, JSONModel) {
	"use strict";

	var SERVER_URL = "http://localhost:3000/odata";

	return Controller.extend("demo.app.controller.Main", {

		onInit: function () {
			var oModel = new JSONModel([]);
			this.getView().setModel(oModel, "countries");
			fetch("http://localhost:3000/countries")
				.then(r => r.json())
				.then(data => oModel.setData(data));
		},

		// user fetching, with optional OData filter
		_load: function (sFilter) {
			if (this._abort) this._abort.abort();
			this._abort = new AbortController();

			var oContainer = this.byId("resultContainer");
			oContainer.destroyItems();

			var sUrl = SERVER_URL + "/Users" + (sFilter ? "?$filter=" + encodeURIComponent(sFilter) : "");

			fetch(sUrl, { signal: this._abort.signal })
				.then(r => r.json())
				.then(data => {
					oContainer.destroyItems();

					if (!data.d.results.length) {
						oContainer.addItem(new Text({ text: "Nincs találat" }));
						return;
					}

					data.d.results.forEach(o => {
						oContainer.addItem(new VBox({
							class: "sapUiSmallMarginBottom",
							items: [
								new Text({ text: "Név: "         + o.user_name }),
								new Text({ text: "Telefonszám: " + o.phone_number })
							]
						}));
					});
				})
				.catch(e => {
					if (e.name !== "AbortError") {
						oContainer.destroyItems();
						oContainer.addItem(new Text({ text: "Hiba: " + e.message }));
					}
				});
		},

		onSearchByName: function () {
			var sValue = this.byId("searchName").getValue().trim();
			if (sValue) this._load("substringof('" + sValue + "',user_name) eq true");
		},

		onSearchByPhone: function () {
			var sValue = this.byId("searchPhone").getValue().trim();
			if (sValue) this._load("substringof('" + sValue + "',phone_number) eq true");
		},

		onShowAll: function () {
			this.byId("searchName").setValue("");
			this.byId("searchPhone").setValue("");
			this._load();
		},

		// user creation logic
		onCreateUser: function () {
			var sName  = this.byId("nameInput").getValue().trim();
			var sCode  = this.byId("countryCode").getSelectedKey();
			var sLocal = this.byId("phoneInput").getValue().trim();
			var sPhone = sCode + sLocal;

			if (!sName || !sLocal) {
				MessageToast.show("Kérem adja meg a nevet és a telefonszámot!");
				return;
			}

			fetch("http://localhost:3000/validate/phone", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone: sPhone })
			})
				.then(r => r.json())
				.then(data => {
					if (!data.valid) {
						MessageToast.show("Hibás telefonszám!");
						return;
					}
					fetch("http://localhost:3000/odata/Users", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ user_name: sName, phone_number: sPhone })
					})
						.then(r => r.json())
						.then(() => {
							MessageToast.show("Sikeresen mentés!");
							this.byId("nameInput").setValue("");
							this.byId("phoneInput").setValue("");
						})
						.catch(err => MessageToast.show("Szerver nem elérhető. Próbálja újra később! (" + err.message + ")"));
				})
				.catch(err => MessageToast.show(err.message));
		}

	});
});
