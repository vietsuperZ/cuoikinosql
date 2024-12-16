document.addEventListener('DOMContentLoaded', function() {
  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');
  const resultCountElement = document.getElementById('result-count');
  const countElement = document.getElementById('count');

  const articles = document.querySelectorAll('.article-item');  // Lấy tất cả bài viết

  // Cập nhật số lượng bài viết khi tìm kiếm
  function updateSearchResults() {
      const searchTerm = searchInput.value.toLowerCase();  // Lấy giá trị tìm kiếm và chuyển thành chữ thường
      let matchingArticles = 0;

      // Duyệt qua tất cả các bài viết và kiểm tra nếu chúng chứa từ khóa tìm kiếm
      articles.forEach(function(article) {
          const title = article.querySelector('h3').textContent.toLowerCase();
          const body = article.querySelector('.article-description').textContent.toLowerCase();
          if (title.includes(searchTerm) || body.includes(searchTerm)) {
              article.style.display = 'block';  // Hiển thị bài viết
              matchingArticles++;
          } else {
              article.style.display = 'none';  // Ẩn bài viết nếu không phù hợp
          }
      });

      // Cập nhật số lượng kết quả
      countElement.textContent = matchingArticles;
      if (matchingArticles > 0) {
          resultCountElement.style.display = 'block';  // Hiển thị số kết quả khi có kết quả
      } else {
          resultCountElement.style.display = 'none';   // Ẩn số kết quả nếu không có kết quả
      }
  }

  // Khi nhấn nút tìm kiếm, thanh tìm kiếm sẽ xuất hiện và focus vào ô input
  for (var i = 0; i < allButtons.length; i++) {
      allButtons[i].addEventListener('click', function() {
          searchBar.style.display = 'block';  // Hiển thị thanh tìm kiếm
          searchBar.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
          searchInput.focus();
      });
  }

  // Khi nhấn nút đóng, thanh tìm kiếm sẽ ẩn đi
  searchClose.addEventListener('click', function() {
      searchBar.style.display = 'none';  // Ẩn thanh tìm kiếm
      searchBar.classList.remove('open');
      this.setAttribute('aria-expanded', 'false');
  });

  // Thêm sự kiện lắng nghe khi người dùng nhập vào ô tìm kiếm
  searchInput.addEventListener('input', updateSearchResults);

  // Cập nhật số lượng kết quả tìm kiếm khi trang được tải
  updateSearchResults();
});

    
    //back to home

    // Lấy phần tử nút quay lại đầu trang
// Lấy nút quay lại đầu trang
const backToTopButton = document.getElementById("backToTop");

// Khi người dùng cuộn trang
window.onscroll = function() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    gsap.to(backToTopButton, { 
      duration: 0.5, 
      opacity: 1,       // Hiển thị nút
      y: 0,             // Hiệu ứng dịch chuyển
      display: 'block'  // Đảm bảo nút xuất hiện
    });
  } else {
    gsap.to(backToTopButton, { 
      duration: 0.5, 
      opacity: 0,       // Ẩn nút
      y: 10,            // Di chuyển nút xuống dưới một chút
      display: 'none'   // Ẩn hoàn toàn nút
    });
  }
};

// Khi người dùng nhấn vào nút quay lại đầu trang
backToTopButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"  // Cuộn mượt mà lên đầu trang
  });
});

function addContent() {
  const contentSection = document.getElementById('content-section');
  const newContent = document.createElement('div');
  newContent.classList.add('content-item');
  
  newContent.innerHTML = `
      <label for="body"><b>Content</b></label>
      <textarea name="body[]" placeholder="Write your content here..."></textarea>

      <label for="image"><b>Image</b></label>
      <input type="file" name="image[]" accept="image/*">
  `;
  
  contentSection.appendChild(newContent);
}