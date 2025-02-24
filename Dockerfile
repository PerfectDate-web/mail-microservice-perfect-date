FROM node:20.16.0-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Copy riêng package.json và package-lock.json trước để cache tốt hơn
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install 

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Chạy ứng dụng
CMD ["npm", "run", "start"]
