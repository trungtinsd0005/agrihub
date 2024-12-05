const express = require("express");
const router = express.Router();
const Product = require("../models/ProductModel");

router.post("/", async (req, res) => {
  const queryResult = req.body.queryResult;
  console.log("Webhook received:", req.body);

  if (queryResult && queryResult.parameters) {
    const disease = queryResult.parameters.benhcay;
    const symptom = queryResult.parameters.trieuchungcay;
    let messageText = "";

    if (disease) {
      try {
        const products = await Product.find({
          description: { $regex: new RegExp(disease, "i") },
        }).select("name description price");
        if (products.length > 0) {
          const productDetails = products
            .map(
              (product) =>
                `${product.name} (Giá: ${product.price.toLocaleString()} VNĐ)`
            )
            .join(", ");
          messageText = `Để điều trị ${disease}, ${productDetails} là một lựa chọn tốt. Khám phá thêm chi tiết sản phẩm để đảm bảo hiệu quả.`;
        } else {
          messageText = `Xin lỗi, tôi chưa có thông tin về bệnh "${disease}".`;
        }
      } catch (error) {
        console.error("Lỗi truy vấn MongoDB:", error);
        messageText = "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.";
      }
    }
    if (symptom) {
      try {
        const products = await Product.find({
          symptoms: { $regex: new RegExp(symptom, "i") },
        }).select("name symptoms price");

        if (products.length > 0) {
          const truncateSymptoms = (symptoms) => {
            const symptomList = Array.isArray(symptoms)
              ? symptoms
              : symptoms.split(". ");
            const firstThreeSymptoms = symptomList.slice(0, 3);

            return (
              firstThreeSymptoms.join(". ") +
              (symptomList.length > 3 ? "..." : "")
            );
          };
          const matchedDiseases = products.map((product) => ({
            name: product.name,
            symptoms: truncateSymptoms(product.symptoms),
            price: product.price.toLocaleString(),
          }));

          messageText = matchedDiseases
            .map(
              (disease) =>
                `Với triệu chứng mà bạn đã mô tả và kèm theo các triệu chứng như: "${disease.symptoms}". Bạn có thể sử dụng "${disease.name}" (Giá: ${disease.price} VNĐ) để điều trị.`
            )
            .join("\n");
        } else {
          messageText = `Tôi không tìm thấy bệnh nào liên quan đến triệu chứng "${symptom}".`;
        }
      } catch (error) {
        console.error("Lỗi truy vấn MongoDB:", error);
        messageText = "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.";
      }
    }
    if (!disease && !symptom) {
      messageText =
        "Tôi không thể hiểu được thông tin bệnh hoặc triệu chứng bạn cung cấp. Bạn có thể thử lại với một câu hỏi khác.";
    }
    return res.json({
      fulfillmentText: messageText,
    });
  } else {
    const messageText = "Không tìm thấy thông tin bệnh cây trong câu hỏi.";
    res.json({
      fulfillmentText: messageText,
    });
  }
});

module.exports = router;
