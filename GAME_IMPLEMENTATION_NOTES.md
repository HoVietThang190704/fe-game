# Ghi Chú Triển Khai Game - Minesweeper PvP

## Cấu Trúc File & Điểm Tích Hợp API

### 1. **Định Nghĩa Kiểu Dữ Liệu**
**File:** `src/app/(private)/game/game.types.ts`

**Mục đích:** Định nghĩa tất cả interface và kiểu TypeScript cho hệ thống game

**Điểm Tích Hợp API:**
- Interface `PlayerCardData` - Sử dụng cho API phản hồi hồ sơ người chơi
  - `username: string` - Tên người chơi từ backend
  - `avatar_url?: string` - URL avatar người chơi từ backend
  - `elo?: number` - Xếp hạng ELO của người chơi từ backend
  - `winRate?: number` - Tỷ lệ thắng % của người chơi từ backend

**Ví Dụ Phản Hồi Backend Dự Kiến:**
```json
{
  "username": "Tên Người Chơi",
  "avatar_url": "https://...",
  "elo": 1250,
  "winRate": 58
}
```

---

### 2. **Tiện Ích Logic Game**
**File:** `src/lib/game/game.utils.ts`

**Mục đích:** Các hàm tiện ích thuần cho tất cả cơ chế game (hoạt động không thay đổi)

**Các Hàm Chính:**
- `createEmptyBoard(mineCount)` - Khởi tạo bàn cờ trống
- `placeMines(board, mineCells[])` - Đặt mìn tại các tọa độ cụ thể
- `revealCell(board, cellId)` - Mở ô với logic tàn lũ
- `toggleFlag(board, cellId)` - Đánh dấu/bỏ đánh dấu ô
- `checkWinCondition(board)` - Kiểm tra nếu tất cả mìn đã được mở

**Điểm Tích Hợp API:**
- Backend nên xác thực các vị trí đặt mìn trước khi trả về đối thủ
- Gửi vị trí mìn đến backend khi `completeSetup()` được gọi trong page.tsx
- Nhận vị trí mìn của đối thủ từ backend cho `opponentBoard`

**Ví Dụ Endpoint API Cần Thiết:**
```
POST /api/game/setup-mines
Body: { gameId, mines: [{ row: 0, col: 1 }, ...] }

GET /api/game/{gameId}/opponent-mines
Response: { mines: [{ row: 0, col: 1 }, ...] }
```

---

### 3. **React Hook Quản Lý Trạng Thái**
**File:** `src/lib/hooks/useGameBoard.ts`

**Mục đích:** Hook tùy chỉnh quản lý trạng thái bàn cờ game và các hành động

**Hooks:**
- `useGameSetup(mineCount)` - Trả về trạng thái setup và hàm chuyển đổi/hoàn thành
- `useGameBoard(mineCount)` - Trả về trạng thái bàn cờ và trình xử lý hành động

**Điểm Tích Hợp API:**
- Khi `completeSetup()` được kích hoạt → Gửi các mìn được chọn đến API backend
- Trạng thái bàn cờ nên được đồng bộ với backend sau mỗi lần di chuyển
- Cập nhật bàn cờ của đối thủ nên đến từ WebSocket backend hoặc polling

**Các Hành Động Cần Tích Hợp:**
```typescript
// Khi setup hoàn thành
const handleSetupComplete = useCallback(() => {
  // TODO: POST /api/game/{gameId}/setup với các mìn đã chọn
  // Chờ xác nhận backend trước khi chuyển được chơi
}, []);

// Khi mở ô
const handleRevealCell = useCallback((cellId) => {
  // TODO: POST /api/game/{gameId}/reveal
  // Backend tính toán hit/miss và trả về kết quả
}, []);
```

---

### 4. **Thành Phần Ô Riêng Lẻ**
**File:** `src/components/game/GameCell.tsx`

**Mục đích:** Render ô đơn lẻ với trạng thái trực quan và tương tác

**Các Trạng Thái Trực Quan Được Xử Lý:**
- `empty` - Không có mìn, không có mìn lân cận
- `revealed` - Được bấm và mở (hiển thị số lượng mìn lân cận)
- `flagged` - Bấm chuột phải và được đánh dấu
- `hit` - Mìn được mở (hoạt ảnh xung đỏ)
- `missed` - Ô trống được mở (xanh/cyan)

**Điểm Tích Hợp API:** Không trực tiếp - được xử lý bởi thành phần GameBoard cha

---

### 5. **Thành Phần Lưới Bàn Cờ**
**File:** `src/components/game/GameBoard.tsx`

**Mục đích:** Render lưới 11x11 (tiêu đề + 100 ô) với trạng thái bàn cờ

**Bố cục:** 
- Tiêu đề cột: A-J (trên cùng)
- Tiêu đề hàng: 1-10 (bên trái)
- 100 ô có thể chơi (10x10)

**Điểm Tích Hợp API:**
- Nhận `board` prop từ thành phần cha (GamePlayPhase)
- Gọi `onCellClick(cellId)` và `onCellRightClick(cellId)` - chuyển đến backend
- Định dạng ID ô: `"row-col"` (ví dụ: "0-0", "9-9")

**Ví Dụ Ánh Xạ ID Ô:**
```
"0-0" = Hàng 1, Cột A
"9-9" = Hàng 10, Cột J
```

---

### 6. **Thành Phần Giai Đoạn Setup Mìn**
**File:** `src/components/game/MineSetupPhase.tsx`

**Mục đích:** UI để đặt 20 mìn trước khi game bắt đầu

**Tính Năng:**
- Thanh tiến trình hiển thị n/20 mìn được chọn
- Nút Clear để đặt lại lựa chọn
- Nút Complete (được bật khi chọn 20 mìn)

**Điểm Tích Hợp API:**
- Khi nút "Complete" được bấm → Gửi vị trí mìn được chọn đến backend
- Backend nên xác thực:
  - Chính xác 20 mìn
  - Tọa độ ô hợp lệ
  - Không có vị trí trùng lặp

**Xác Thực Backend Dự Kiến:**
```typescript
onConfirm = useCallback(() => {
  // TODO: Gọi API để xác thực và lưu setup mìn
  // Chỉ chuyển sang giai đoạn playing sau khi backend xác nhận
  const setupData = {
    gameId: props.gameId,
    selectedCells: Array.from(setupState.selectedCells),
    timestamp: new Date().toISOString()
  };
  // await POST /api/game/setup-complete
}, []);
```

---

### 7. **Thành Phần Giai Đoạn Gameplay**
**File:** `src/components/game/GamePlayPhase.tsx`

**Mục đích:** UI gameplay chính với hai bàn cờ và quản lý lượt chơi

**Bố cục:**
- **Bàn cờ BÊN TRÁI**: Bàn cờ của đối thủ (nơi bạn tấn công) - Tương tác khi LƯỢT CỦA BẠN
- **Bàn cờ BÊN PHẢI**: Bàn cờ của bạn (phòng thủ/chỉ đọc)
- Thống kê dưới mỗi bàn cờ (Hits/Misses)
- Nút kỹ năng dưới thống kê (3 nút tròn)

**Điểm Tích Hợp API - VỀ CHÍNH:**

**Cho Bàn Cờ Bên Trái (Tấn Công):**
```typescript
onCellClick = (cellId: string) => {
  // TODO: POST /api/game/{gameId}/attack
  // Body: { cellId: "row-col", action: "reveal" }
  // Response: { result: "hit" | "miss", remainingMines: number }
}

onCellRightClick = (cellId: string) => {
  // TODO: POST /api/game/{gameId}/flag
  // Body: { cellId: "row-col", action: "flag" }
  // Response: { flagCount: number }
}
```

**Cho Nút Kỹ Năng:**
```typescript
onPowerUse = (boardSide: "left" | "right", powerIndex: 1 | 2 | 3) => {
  // TODO: Triển khai cơ chế kỹ năng
  // boardSide: "left" = tấn công, "right" = phòng thủ
  // powerIndex: 1 = Zap, 2 = Shield, 3 = Eye
  // POST /api/game/{gameId}/use-power
  // Body: { powerType, target: boardSide }
}
```

**Hiển Thị Thống Kê:**
```typescript
// Thống kê bàn cờ BÊN TRÁI hiển thị KẾT QUẢ TẤN CÔNG của Bạn
{
  playerHits: number,      // Tổng số ô bạn mở ra có mìn
  playerMisses: number     // Tổng số ô bạn mở ra không có mìn
}

// Thống kê bàn cờ BÊN PHẢI hiển thị KẾT QUẢ TẤN CÔNG của Đối Thủ lên bạn
{
  opponentHits: number,    // Bao nhiêu mìn của bạn mà đối thủ tìm thấy
  opponentMisses: number   // Bao nhiêu ô trống mà đối thủ mở ra
}
```

---

### 8. **Thành Phần Thẻ Thông Tin Người Chơi**
**File:** `src/components/game/GamePlayerInfo.tsx`

**Mục đích:** Hiển thị avatar, tên, ELO và tỷ lệ thắng của người chơi ở trên mỗi bàn cờ

**Props:**
```typescript
interface PlayerCardData {
  username: string;
  avatar_url?: string;
  elo?: number;
  winRate?: number;
  isOpponent?: boolean;  // Hiển thị badge "Opponent" nếu đúng
}
```

**Điểm Tích Hợp API:**
- Lấy dữ liệu người chơi từ API hồ sơ/tài khoản backend
- Lưu dữ liệu người chơi để tránh các yêu cầu lặp lại

**Endpoint Backend Cần Thiết:**
```
GET /api/user/profile
Response: {
  username: string,
  avatar_url: string,
  elo: number,
  winRate: number
}

GET /api/user/{opponentId}/profile
Response: {
  username: string,
  avatar_url: string,
  elo: number,
  winRate: number
}
```

---

### 9. **Thành Phần Nút Kỹ Năng**
**File:** `src/components/game/PowerButtons.tsx`

**Mục đích:** Ba nút tròn cho các khả năng đặc biệt

**Các Nút:**
1. **Kỹ Năng 1 (Zap - Vàng)** - Khả năng quét/tia sét?
2. **Kỹ Năng 2 (Shield - Xanh)** - Khả năng phòng thủ/bảo vệ?
3. **Kỹ Năng 3 (Eye - Tím)** - Khả năng nhìn thấu/tiết lộ?

**Điểm Tích Hợp API:**
```typescript
// Mỗi nút kích hoạt một callback với chỉ số kỹ năng
onPower1 = () => {
  // TODO: POST /api/game/{gameId}/power
  // Body: { powerType: 1, boardSide: "left" | "right" }
}

onPower2 = () => {
  // TODO: POST /api/game/{gameId}/power
  // Body: { powerType: 2, boardSide: "left" | "right" }
}

onPower3 = () => {
  // TODO: POST /api/game/{gameId}/power
  // Body: { powerType: 3, boardSide: "left" | "right" }
}
```

**Logic Vô Hiệu Hóa:**
- Nút bàn cờ BÊN TRÁI: Vô hiệu hóa khi KHÔNG PHẢI lượt của bạn
- Nút bàn cờ BÊN PHẢI: Vô hiệu hóa khi lượt của đối thủ

---

### 10. **Trang Game Chính - Điều Phối**
**File:** `src/app/(private)/game/page.tsx`

**Mục đích:** Trang game chính quản lý các giai đoạn và điều phối trạng thái

**Luồng Hiện Tại:**
1. **Giai Đoạn Setup** → Người chơi đặt 20 mìn
2. **Giai Đoạn Playing** → Gameplay dựa trên lượt chơi

```typescript
// Quản lý giai đoạn
const [gamePhase, setGamePhase] = useState<"setup" | "playing">("setup");
const [currentPlayer, setCurrentPlayer] = useState<"you" | "opponent">("you");

// Trạng thái bàn cờ
const yourBoard = useGameBoard(20);      // Nơi đối thủ tấn công bạn
const opponentBoard = useGameBoard(20);  // Nơi bạn tấn công

// Theo dõi thống kê
const [stats, setStats] = useState({
  playerHits: 0,        // Tấn công thành công của bạn
  playerMisses: 0,      // Tấn công thất bại của bạn
  opponentHits: 0,      // Tấn công thành công của đối thủ lên bạn
  opponentMisses: 0     // Tấn công thất bại của đối thủ lên bạn
});
```

**Điểm Tích Hợp API - VỀ CHÍNH:**

**Hoàn Thành Giai Đoạn Setup:**
```typescript
const handleSetupComplete = useCallback(() => {
  // 1. Lưu mìn của bạn đến backend
  // POST /api/game/setup-mines
  yourBoard.placeMinesOnBoard(selectedCells);
  
  // 2. Mô phỏng đối thủ thiết lập (nên đến từ backend)
  // GET /api/game/{gameId}/opponents-ready hoặc sự kiện WebSocket
  opponentBoard.placeMinesOnBoard(randomOpponentCells);
  
  // 3. Chuyển sang playing
  setGamePhase("playing");
}, []);
```

**Giai Đoạn Gameplay - Bấm Ô:**
```typescript
const handleCellClick = useCallback((cellId: string) => {
  if (currentPlayer !== "you") return;
  
  // TODO: POST /api/game/{gameId}/attack
  opponentBoard.reveal(cellId);
  
  // Lấy kết quả từ backend
  const result = await api.attack(cellId);
  if (result === "hit") {
    setStats(prev => ({...prev, playerHits: prev.playerHits + 1}));
  } else {
    setStats(prev => ({...prev, playerMisses: prev.playerMisses + 1}));
    setCurrentPlayer("opponent");  // Lượt kết thúc khi miss
  }
}, [currentPlayer, opponentBoard]);
```

**Quản Lý Lượt Chơi:**
```typescript
// Khi miss → chuyển sang đối thủ
// Khi hit → tiếp tục lượt của bạn
// WebSocket/polling nên cập nhật currentPlayer khi đối thủ kết thúc
```

**Tích Hợp Dữ Liệu Người Chơi:**
```typescript
// Lấy và chuyển dữ liệu người chơi
const playerData = {
  username: "Bạn",
  avatar_url: "...",
  elo: 1250,
  winRate: 58
};

const opponentData = {
  username: "Đối Thủ",
  avatar_url: "...",
  elo: 1200,
  winRate: 55
};
```

---

## Tóm Tắt Endpoint API (Danh Sách Kiểm Tra Phát Triển Backend)

### Giai Đoạn Setup
- [ ] `POST /api/game/setup-mines` - Lưu địa điểm đặt mìn của người chơi
- [ ] `GET /api/game/{gameId}/opponent-setup` - Lấy trạng thái sẵn sàng của đối thủ
- [ ] Xác thực: 20 mìn, tọa độ hợp lệ, không có trùng lặp

### Giai Đoạn Gameplay
- [ ] `POST /api/game/{gameId}/attack` - Mở ô (trả về hit/miss)
  - Input: `{ cellId: "row-col" }`
  - Output: `{ result: "hit"|"miss", revealedCell: {...} }`

- [ ] `POST /api/game/{gameId}/flag` - Đánh dấu ô có mìn
  - Input: `{ cellId: "row-col", action: "flag"|"unflag" }`
  - Output: `{ flagged: boolean }`

- [ ] `POST /api/game/{gameId}/use-power` - Sử dụng khả năng đặc biệt
  - Input: `{ powerType: 1|2|3, boardSide: "left"|"right" }`
  - Output: `{ success: boolean, effect: {...} }`

### Trạng Thái Game
- [ ] `GET /api/game/{gameId}` - Lấy trạng thái game hiện tại
  - Output: `{ phase, currentPlayer, stats, boards, ... }`

### Dữ Liệu Người Chơi
- [ ] `GET /api/user/profile` - Lấy hồ sơ người chơi hiện tại
- [ ] `GET /api/user/{userId}/profile` - Lấy hồ sơ đối thủ

### Thời Gian Thực (WebSocket hoặc Polling)
- [ ] Cập nhật nước đi của đối thủ
- [ ] Thay đổi lượt chơi
- [ ] Hiệu ứng khả năng đặc biệt
- [ ] Trạng thái kết thúc game

---

## Dữ Liệu Mock Hiện Tại (Cần Thay Thế)

**Trong `page.tsx` - Dữ Liệu Người Chơi Mock:**
```typescript
playerData={{
  username: "Bạn",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
  elo: 1250,
  winRate: 58,
}}
opponentData={{
  username: "Đối Thủ",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=opponent",
  elo: 1200,
  winRate: 55,
}}
```

**Trong `page.tsx` - Mock Thiết Lập Đối Thủ:**
```typescript
// Nên được thay thế bằng dữ liệu đối thủ thực từ backend
const randomCells = new Set<string>();
while (randomCells.size < 20) {
  const randomId = `${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}`;
  randomCells.add(randomId);
}
opponentBoard.placeMinesOnBoard(Array.from(randomCells));
```

---

## Các Bước Tiếp Theo Để Tích Hợp Backend

1. **Triển Khai API Giai Đoạn Setup** - Chấp nhận và xác thực các vị trí đặt mìn
2. **Triển Khai Quản Lý Trạng Thái Game** - Theo dõi sự tiến triển game trên backend
3. **Triển Khai Logic Tấn Công** - Xử lý việc mở ô và tính toán hit/miss
4. **Triển Khai Cập Nhật Thời Gian Thực** - WebSocket để thay đổi lượt chơi và cập nhật game
5. **Triển Khai Hệ Thống Kỹ Năng** - Định nghĩa và xử lý khả năng đặc biệt
6. **Triển Khai Hồ Sơ Người Dùng** - Lấy/Cập Nhật ELO và thống kê của người chơi
7. **Thêm Lịch Sử Game** - Lưu trữ các game hoàn thành để tính toán thống kê
8. **Thêm Matchmaking** - Xếp hàng và ghép đôi người chơi

---

## Ghi Chú Cho Nhà Phát Triển Frontend

- Tất cả logic game là **phía frontend** (hiện tại) - vẫn cần xác thực trên backend
- Trạng thái bàn cờ sử dụng **cập nhật không thay đổi** (không bao giờ thay đổi trực tiếp bàn cờ)
- ID ô có định dạng `"row-col"` (0-indexed, ví dụ: "0-0" đến "9-9")
- Logic lượt chơi: **Hit = tiếp tục lượt**, **Miss = chuyển lượt**
- Thống kê được theo dõi trong page.tsx và chuyển xuống dưới dạng props
- Nút kỹ năng hiện tại là trình giữ chỗ (không có cơ chế nào được triển khai)
