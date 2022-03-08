App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            // App.fetchItemBufferOne();
            // App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();
        App.readForm();
        console.log("UPC at handle button click: " + App.upc);
        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.farmItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.purchaseItemByRoaster(event);
                break;
            case 4:
                return await App.roastItem(event);
                break;
            case 5:
                return await App.purchaseItemByCafe(event);
                break;
            case 6:
                return await App.orderItem(event);
                break;
            case 7:
                return await App.brewItem(event);
                break;
            case 8:
                return await App.drinkItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11: 
                return await App.getInfo(event);
                break;
            }
    },


    farmItem: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.farmItem(
                App.upc, 
                App.originFarmName,
                App.originFarmLongitude,
                App.originFarmLatitude, 
                App.productNotes, 
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('farmItem',result);
            App.getInfo(event);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
            App.getInfo(event);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    purchaseItemByRoaster: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItemByRoaster(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItemByRoaster',result);
            App.getInfo(event);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    roastItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.roastItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
            App.getInfo(event);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItemByCafe: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            // const productPrice = web3.toWei(1, "ether");
            console.log("Product price " + App.productPrice);
            return instance.purchaseItemByCafe(App.upc, App.productPrice, {from: App.metamaskAccountID} )
            console.log('productPrice',productPrice);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItemByCafe',result);
            App.getInfo(event);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    orderItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            // const walletValue = web3.toWei(3, "ether");
            return instance.orderItem(App.upc, {from: App.metamaskAccountID, value: App.productPrice});

        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('orderItem',result);
            App.getInfo(event);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    brewItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.brewItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('brewItem',result);
            App.getInfo(event);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    drinkItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.drinkItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('drinkItem',result);
            App.getInfo(event);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    },

    getInfo: function () {
        console.log("UPC: " + App.upc);
        $("#ftc-item").text("");
        $("#ftc-upc").text("");
        $("#ftc-sku").text("");
        $("#ftc-ownerid").text("");
        $("#ftc-farmname").text("");
        $("#ftc-farmid").text("");
        $("#ftc-farmlng").text("");
        $("#ftc-farmlat").text("");
        $("#ftc-itemstate").text("");
        $("#ftc-productprice").text("");
        $("#ftc-roastdate").text("");
        $("#ftc-roasterid").text("");
        $("#ftc-cafeid").text("");
        $("#ftc-consumerid").text("");

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne.call(App.upc);
        }).then(function(result) {
            console.log('fetchItemBufferOne', result);
            $("#ftc-item").text(result);
            $("#ftc-sku").text(result[0]);
            $("#ftc-upc").text(result[1]);
            $("#ftc-ownerid").text(result[2]);
            $("#ftc-farmname").text(result[4]);
            $("#ftc-farmid").text(result[3]);
            $("#ftc-farmlng").text(result[6]);
            $("#ftc-farmlat").text(result[7]);
        }).catch(function(err) {
          console.log(err.message);
        });


        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
            console.log('fetchItemBufferTwo', result);
            $("#ftc-item").text(result);
            const itemState = parseInt(result[2]);
            const states = ['Farmed', 'Processed', 'Purchased By Roaster', 'Roasted', 'Purchased By Cafe', 'Ordered', 'Brewed', 'Consumed'];
            $("#ftc-itemstate").text(states[itemState]);
            $("#ftc-productprice").text(result[4]);

            var roastDate = parseInt(result[5]) * 1000;
            if (roastDate > 0) {
                var roastDate_readable  = new Date(roastDate);
                $("#ftc-roastdate").text(roastDate_readable);
            }
            $("#ftc-roasterid").text(result[6]);
            $("#ftc-cafeid").text(result[7]);
            $("#ftc-consumerid").text(result[8]);
        }).catch(function(err) {
          console.log(err.message);
        });

    },


};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
