function randomNum(m, n){
    return Math.floor(Math.random()*(n-m))+m;
}

function randomFloat(m, n){
    return parseFloat((Math.random()*(n-m)+m).toFixed(2));
}

function dataGenerater(role, num, minPrice, maxPrice, minAmount, maxAmount){
    let id = 0, data = [];
    while(id<num){
        let dataDetail = {};
        dataDetail.id = id, id += 1;
        dataDetail.price = randomFloat(minPrice, maxPrice);
        dataDetail.amount = randomNum(minAmount, maxAmount);
        data.push(dataDetail);
    }
    return data;

}

function trade(sellBids, buyBids){
    let m = sellBids.length, n = buyBids.length;
    let sellRest = [], buyRest = [], tradeRecord = [];
    let sid = 0, bid = 0;
    while(sid < m && bid < n){
        // console.log("sellerId: "+sid+", buyerId: "+bid);
        let nowSeller = sellBids[sid], nowBuyer = buyBids[bid];
        if(nowSeller.price<=nowBuyer.price){
            let tradeDetail = {};
            tradeDetail.seller = nowSeller.id;
            tradeDetail.buyer = nowBuyer.id;
            tradeDetail.price = parseFloat(((nowSeller.price+nowBuyer.price) / 2).toFixed(2));
            if(nowSeller.amount>=nowBuyer.amount) {
                tradeDetail.amount = nowBuyer.amount, bid += 1;
                nowSeller.amount -= nowBuyer.amount, nowBuyer.amount = 0;
            }
            
            else{
                tradeDetail.amount = nowSeller.amount, sid += 1;
                nowBuyer.amount -= nowSeller.amount, nowSeller.amount = 0;
            }
            tradeRecord.push(tradeDetail);
        }
        else{
            sellRest.push(nowSeller), sid += 1;
            buyRest.push(nowBuyer), bid += 1;
        }
    }
    console.log('tradeRecord: '), console.log(tradeRecord);
    console.log('sellRest: '), console.log(sellRest);
    console.log('buyRest: '), console.log(buyRest);

}
function generate(){
    var data = [];
    var sellerData = dataGenerater('seller', 13, 4.5, 9.8, 120, 240).sort(function(a, b){
        return a.price-b.price;
    });
    var buyerData = dataGenerater('buyer', 9, 2.3, 7.8, 50, 130).sort(function(a, b){
        return b.price-a.price;
    });
    data.push(sellerData), data.push(buyerData);
    console.log('Seller: '), console.log(sellerData);
    console.log('Buer: '), console.log(buyerData);
    return data;
}
var fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.sort();
var data = generate();
// console.log(data);
trade(data[0], data[1]);

// console.log(randomNum(7, 34));
// console.log(randomFloat(2.3, 9.8));


