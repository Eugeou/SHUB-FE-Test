async function fetchData() {
  // Sử dụng dịch vụ CORS Anywhere cung cấp proxy server, tránh CORS
  const apiUrl =
    "https://cors-anywhere.herokuapp.com/https://test-share.shub.edu.vn/api/intern-test/input";
  try {
    document.getElementById("loader").style.display = "block";
    const response = await fetch(apiUrl);
    const data = await response.json();
    document.getElementById("loader").style.display = "none";
    return data;
    //console.log(data);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  }
}

function processQueries(data, queries) {
  const prefixSum = new Array(data.length + 1).fill(0);
  const alternateSum = new Array(data.length + 1).fill(0);

  for (let i = 1; i <= data.length; i++) {
    prefixSum[i] = prefixSum[i - 1] + data[i - 1];
    alternateSum[i] =
      alternateSum[i - 1] + (i % 2 === 1 ? data[i - 1] : -data[i - 1]);
  }

  const results = [];

  queries.forEach((query) => {
    const [l, r] = query.range;
    let result;

    if (query.type === "1") {
      // Truy vấn loại 1: Tổng các phần tử từ l đến r
      result = prefixSum[r + 1] - prefixSum[l];
    } else if (query.type === "2") {
      // Truy vấn loại 2: Tổng chẵn lẻ luân phiên
      result = alternateSum[r + 1] - alternateSum[l];
    }

    results.push(result);
    console.log(result);
  });

  return results;
}

async function submitResult(results, token) {
  // Sử dụng dịch vụ CORS Anywhere cung cấp proxy server, tránh CORS
  const apiUrl =
    "https://cors-anywhere.herokuapp.com/https://test-share.shub.edu.vn/api/intern-test/output";
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(results),
    });

    if (!response.ok) {
      throw new Error("Lỗi khi gửi kết quả");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Lỗi khi gửi kết quả:", error);
  }
}

async function main() {
  const data = await fetchData();
  const { token, data: arrayData, query } = data;

  const results = processQueries(arrayData, query);

  const submitResponse = await submitResult(results, token);

  // Hiển thị kết quả
  document.getElementById(
    "result"
  ).innerText = `Kết quả đã được gửi: ${JSON.stringify(submitResponse)}`;
}

// Chạy chương trình
main();
