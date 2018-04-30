const _ = require('lodash');
const data = require('./data').obj.coupon_codes;
const async = require('async');

function processOrder(cart_items, coupon_code, outlet_id) {
	this.total_amount = 0;
	this.discount = 0;
	this.cashback = 0;
	this.isCouponValid = false;
	this.appliedStatus = false;
	this.message = '';
	this.couponObj = coupon_code ? _.find(data, {
		code: coupon_code
	}) : {}; // obtaining coupon info

	this.response = {
		"valid": this.isCouponValid,
		"message": this.message,  // or failure message,
		"discount": this.discount,
		"cashback": this.cashback,
		"total_amount" : this.total_amount,
		"amount_to_pay" : 0,
	}

	this.inititate = () => {
		return this.checkCouponApplicability();
	}

	this.calculateCart = () => {
		let total = 0;
		for(let i = 0 ; i < cart_items.length ; i++){
			const cart_item = cart_items[i];
			total = total + (cart_item.quantity * cart_item.unit_cost); 
		}
		this.total_amount = total;
		return this.checkForDiscount();
	}

	this.checkCouponApplicability = () => {
		if(!_.isEmpty(this.couponObj)){ 
			const couponInfo = this.couponObj;
			let isValid = false;
			let valid_on_outlet = false;
			if(couponInfo.active && 
				new Date() <= new Date(couponInfo.end_date) && 
				new Date() >= new Date(couponInfo.start_date)){
				// coupon is valid and can be applied
				isValid = true;
			}
			if(couponInfo.applicable_outlet_ids.indexOf(outlet_id) > -1 || !outlet_id){
				valid_on_outlet = true;
			}
			
			if(valid_on_outlet && isValid){
				// now calculate cart
				return this.calculateCart();
			}else{
				this.response.message = !valid_on_outlet ? 'Coupon not applicable on this outlet' : 'Coupon invalid or expired';
				return this.response;
			}
		}else{
			// coupon info not available
			this.response.message = 'You have not entered any coupon';
			return this.response;
		}
	}
	
	this.checkForDiscount = () => {
		const type = this.couponObj.type;
		const couponInfo = this.couponObj;
		let discount = 0;
		switch (type){
			case 'Percentage':
				discount = this.total_amount*(couponInfo.value/100);
				return this.applyDiscount(discount);

			case 'Discount':
				return this.applyDiscount(couponInfo.value);

			case 'Discount&Cashback':
				return this.applyDiscount(couponInfo.value);

			case 'Bogo':

				let total_cart_items = _.reduce(_.map(cart_items,'quantity'),(sum,num) => {
					return sum + num;
				},0);
				if(total_cart_items >= 2){
					const discount_items_count = Math.floor(total_cart_items/2);
					const cart_items_in_desc = _.orderBy(cart_items,['unit_cost']);
					let discount_applied = false;
					let discount_applied_count = 0;
					let total_discount = 0;
					let i = 0;
					while(!discount_applied){
						const apply_discount_for_count = discount_items_count - discount_applied_count;
						if(cart_items_in_desc[i].quantity >= apply_discount_for_count){
							total_discount += apply_discount_for_count * cart_items_in_desc[i].unit_cost;
						//	discount_applied_count = cart_items_in_desc[i].quantity;
							discount_applied = true;
						}else{
							total_discount += cart_items_in_desc[i].quantity * cart_items_in_desc[i].unit_cost;
							discount_applied_count += cart_items_in_desc[i].quantity;
							i++;
						}
					}
					return this.applyDiscount(total_discount);
				}else{
					this.response.message = 'Select one more item to apply this code';
					return this.response;
				}
		}
	}
	this.applyDiscount = (discount) => {
		const couponInfo = this.couponObj;
		if(discount > couponInfo.maximum_discount){
			discount = couponInfo.maximum_discount
		}
		let amount_after_discount = this.total_amount - discount;
		if(amount_after_discount < couponInfo.minimum_delivery_amount_after_discount){
			this.response.message = `Select more items to apply this coupon.`;
			return this.response;
		}else{
			this.response.discount = discount;
			this.response.message = 'Coupon applied successfully';
			this.response.cashback = couponInfo.cashback_value;
			this.response.total_amount = this.total_amount;
			this.response.amount_to_pay = amount_after_discount;
			return this.response;
		}
	}
}

const cart = {
	"cart_items": [{
			"product_id": 1,
			"quantity": 1,
			"unit_cost": 100
		},
		{
			"product_id": 2,
			"quantity": 2,
			"unit_cost": 50
		},
		{
			"product_id": 3,
			"quantity": 2,
			"unit_cost": 50
		}
	],
	coupon_code : 'BOGO',
	outlet_id : ''
}
const order = new processOrder(cart.cart_items, cart.coupon_code, cart.outlet_id);
console.log(order.inititate());