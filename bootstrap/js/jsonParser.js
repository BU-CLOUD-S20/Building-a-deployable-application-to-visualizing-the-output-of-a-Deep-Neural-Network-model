function jsonParser(jString) {
	let resp = JSON.parse(jString)
	if (Array.isArray(resp[0])) {
		if (resp[0][0].hasOwnProperty("top")) {
			//will need to target a different feature if another scenario ends up doing rectangle boxes
			for (let img of resp[0]) {
				for (let box of img) {
					let x = box.left
					let y = box.top
					let width = box.right - box.left
					let height = box.bottom - box.top
					let label = box.label
					let prob = box.score
					//call rendering functions
				}
			}
			return "detection"
		}
		return "err"
	}
	if(resp.hasOwnProperty("probability")) {
		//do function for classification rendering
		for (let img of resp) {
			//call function
		}
		return "classification"
	}
	if(resp.hasOwnProperty("distance")) {
		//do function for image similarity
		for (let img of resp) {
			//call function
		}
		return "similarity"
	}
	return "err"
}

function createTestArray(){
	let ret = []
	ret.push('[{"label": "water_bottle", "probability": "0.8001841306686401"}, {"label": "water_bottle", "probability": "0.68577641248703"}]')
	ret.push('[[{"top": "153", "left": "96", "bottom": "515", "right": "234", "label_name": "carton", "label_idx": "2", "score": "0.9971401691436768"}], [{"top": "182", "left": "241", "bottom": "509", "right": "367", "label_name": "milk_bottle", "label_idx": "4", "score": "0.7514153122901917"}, {"top": "184", "left": "238", "bottom": "494", "right": "359", "label_name": "water_bottle", "label_idx": "1", "score": "0.5189343094825745"}]]')
	ret.push('[{"label": "water_bottle", "filename": "1.jpg", "distance": 0.00001}, {"label": "can", "filename": "2.jpg", "distance": 0.9}]')
	ret.push('[[{"label": "water_bottle", "other": "other"}]]')
	//ret.push('[]')
	ret.push('[{}]')
	ret.push('[[{}]]')
	ret.push('[{"bad": "bad"}]')
	return ret
}

function test() {
	for (let s of createTestArray()) {
		console.log(jsonParser(s));
	}
}