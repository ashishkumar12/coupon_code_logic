module.exports = {
	obj: {
		"coupon_codes": [{
				"id": 1,
				"code": "BOX8LOVE",
				"type": "Percentage",
				"value": 10,
				"cashback_value": 0,
				"start_date": "2015-07-01",
				"end_date": "2019-12-31",
				"active": true,
				"applicable_outlet_ids": [1, 2, 3, 4, 5, 6],
				"minimum_delivery_amount_after_discount": 150,
				"maximum_discount": 200
			},
			{
				"id": 2,
				"code": "HELLOBOX8",
				"type": "Discount",
				"value": 150,
				"cashback_value": 0,
				"start_date": "2015-07-01",
				"end_date": "2019-12-31",
				"active": true,
				"applicable_outlet_ids": [],
				"minimum_delivery_amount_after_discount": 100,
				"maximum_discount": 150
			},
			{
				"id": 3,
				"code": "GETCASHBACK",
				"type": "Discount&Cashback",
				"value": 150,
				"cashback_value": 150,
				"start_date": "2015-07-01",
				"end_date": "2019-12-31",
				"active": true,
				"applicable_outlet_ids": [],
				"minimum_delivery_amount_after_discount": 200,
				"maximum_discount": 150
			},
			{
				"id": 4,
				"code": "BOGO",
				"type": "Bogo",
				"value": 0,
				"cashback_value": 0,
				"start_date": "2015-07-01",
				"end_date": "2019-12-31",
				"active": true,
				"applicable_outlet_ids": [2, 3, 10],
				"minimum_delivery_amount_after_discount": 200,
				"maximum_discount": 1500
			}
		]
	}
}