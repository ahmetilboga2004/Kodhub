import User from "./user.js";
import Project from "./project.js";
import Position from "./position.js";
import Application from "./application.js";

User.hasMany(Project, { onDelete: "CASCADE" });
Project.belongsTo(User, { onDelete: "CASCADE" });

Project.hasMany(Position, { onDelete: "CASCADE" });
Position.belongsTo(Project, { onDelete: "CASCADE" });

User.hasMany(Application, { onDelete: "CASCADE" });
Position.belongsTo(User, { onDelete: "CASCADE" });

Position.hasMany(Application, { onDelete: "CASCADE" });
Application.belongsTo(Position, { onDelete: "CASCADE" });

Application.belongsTo(User, { onDelete: "CASCADE" });
