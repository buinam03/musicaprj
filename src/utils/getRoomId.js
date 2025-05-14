/**
 * Trả về roomId duy nhất cho 2 user, hoặc null nếu self-chat.
 * Luôn sắp xếp sao cho ID nhỏ hơn đứng trước, tránh lộn room “23_26” vs “26_23”.
 *
 * @param {number|string} a 
 * @param {number|string} b 
 * @returns {string|null} 
 */
function getRoomId(a, b) {
  const idA = Number(a);
  const idB = Number(b);
  if (idA === idB) return null;         
  return idA < idB
    ? `${idA}_${idB}`
    : `${idB}_${idA}`;
}