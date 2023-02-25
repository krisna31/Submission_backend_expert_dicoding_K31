/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"threads"',
      onDelete: "cascade",
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_deleted: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
  });
  pgm.addConstraint("comments", "fk_comments.owner_users.id", "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE");
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
