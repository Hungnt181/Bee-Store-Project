import crypto from "crypto";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

class VNPayController {
	createBill(req, res) {
		let { amount, orderId } = req.body;
		let date = new Date();
		let createDate = date
			.toISOString()
			.replace(/[-:T.]/g, "")
			.slice(0, 14);

		let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

		const config = {
			vnp_TmnCode: process.env.VNP_TMNCODE,
			vnp_HashSecret: process.env.VNP_HASHSECRET,
			vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
			vnp_ReturnUrl: "http://localhost:5173/notify",
		};

		let vnp_Params = {
			vnp_Version: "2.1.0",
			vnp_Command: "pay",
			vnp_TmnCode: config.vnp_TmnCode,
			vnp_Amount: Number(amount) * 100, // VNPay yêu cầu đơn vị là VND * 100
			vnp_CurrCode: "VND",
			vnp_TxnRef: orderId,
			vnp_OrderInfo: `Thanh_toan_don_hang_${orderId}`,
			vnp_OrderType: "billpayment",
			vnp_Locale: "vn",
			vnp_ReturnUrl: config.vnp_ReturnUrl,
			vnp_IpAddr: ipAddr,
			vnp_CreateDate: createDate,
		};

		let sortedParams = Object.keys(vnp_Params)
			.sort()
			.reduce((acc, key) => {
				acc[key] = vnp_Params[key];
				return acc;
			}, {});

		let signData = qs.stringify(sortedParams);
		let hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
		let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

		let paymentUrl = `${config.vnp_Url}?${signData}&vnp_SecureHash=${signed}`;

		res.json({ paymentUrl });

    console.log("params: ", vnp_Params);
    console.log("url: ", paymentUrl);
	}

	returnPayment(req, res) {
	  const vnp_Params = req.query;
	  const secureHash = vnp_Params["vnp_SecureHash"];
	  delete vnp_Params["vnp_SecureHash"];
	  delete vnp_Params["vnp_SecureHashType"];

	  const signData = querystring.stringify(vnp_Params, { encode: false });
	  const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
	  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

	  if (secureHash === signed) {
	    res.json({ status: "success", message: "Payment successful", data: vnp_Params });
	  } else {
	    res.json({ status: "error", message: "Payment failed" });
	  }
	}

	checkPayment(req, res) {
	  res.json({ message: "Check payment status API" });
	}
}

export default VNPayController;
