import pg from "pg";
const { Pool } = pg;

let pool;
function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
      connectionString,
      application_name: "",
      max: 1,
    });
  }
  return pool;
}

// users

export async function getUser(sub) {
  const res = await getPool().query(
    `SELECT * FROM users WHERE id = $1`,
    [sub]
  );
  return res.rows[0];
}

export async function createUser(sub, username) {
  const res = await getPool().query(
    `
    INSERT INTO users (id, username)
    VALUES ($1, $2)
    RETURNING *
    `,
    [sub, username]
  );
  return res.rows[0];
}

export async function updateUser(sub, username, bio, profileImgName) {
  const res = await getPool().query(
    `
    UPDATE users
    SET username = $1, bio = $2, profile_img_name = $3
    WHERE id = $4
    RETURNING *
    `,
    [username, bio, profileImgName, sub]
  );
  return res.rows[0];
}

// chats

export async function getChats() {
  const res = await getPool().query(
    `
    SELECT * FROM chats
    ORDER BY timestamp DESC
    `,
  );
  return res.rows;
}

export async function getChat(chatId, sub) {
  const res = await getPool().query(
    `
    SELECT * FROM chats
    WHERE id = $1 AND user_id = $2
    `,
    [chatId, sub]
  );
  return res.rows[0];
}

export async function createChat(sub, name) {
  const res = await getPool().query(
    `
    INSERT INTO chats (user_id, name)
    VALUES ($1, $2)
    RETURNING *
    `,
    [sub, name]
  );
  return res.rows[0];
}

export async function updateChat(chatId, sub, name) {
  const res = await getPool().query(
    `
    UPDATE chats
    SET name = $1
    WHERE id = $2 AND user_id = $3
    RETURNING *
    `,
    [name, chatId, sub]
  );
  return res.rows[0];
}

export async function deleteChat(chatId, sub) {
  const res = await getPool().query(
    `
    DELETE FROM chats
    WHERE id = $1 AND user_id = $2
    RETURNING *
    `,
    [chatId, sub]
  );
  return res.rows[0];
}

// messages

// return all rows from the messages table plus the usernames
export async function getMessages(chatId) {
  const res = await getPool().query(
    `
    SELECT 
      m.id, 
      m.user_id, 
      m.chat_id,
      m.content, 
      m.timestamp,
      u.username
    FROM messages m INNER JOIN users u ON m.user_id = u.id
    WHERE chat_id = $1
    ORDER BY timestamp ASC
    `,
    [chatId]
  );
  return res.rows;
}

// return a single row from the messages table
export async function getMessage(messageId, sub) {
  const res = await getPool().query(
    `
    SELECT * FROM messages
    WHERE id = $1 AND user_id = $2
    `,
    [messageId, sub]
  );
  return res.rows[0];
}

export async function createMessage(sub, chatId, content) {
  const res = await getPool().query(
    `
    INSERT INTO messages (user_id, chat_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [sub, chatId, content]
  );
  return res.rows[0];
}

export async function updateMessage(messageId, sub, content) {
  const res = await getPool().query(
    `
    UPDATE messages
    SET content = $1
    WHERE id = $2 AND user_id = $3
    RETURNING *
    `,
    [content, messageId, sub]
  );
  return res.rows[0];
}

export async function deleteMessage(messageId) {
  const res = await getPool().query(
    `
    DELETE FROM messages
    WHERE id = $1
    RETURNING *
    `,
    [messageId]
  );
  return res.rows[0];
}
