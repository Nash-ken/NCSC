interface LogEntry {
    type: string;
    result: string;
    identifier: string;
    date: Date;
    ipv4: string;
    reason: string | null;
    agent: string | null;
    role: string;
  }
  
  const createLogEntry = async ({
    type,
    result,
    identifier,
    ipv4,
    reason,
    agent,
    role
  }: LogEntry): Promise<void> => {
    try {
      await strapi.db.query("api::log.log").create({
        data: {
          type,
          result,
          identifier,
          date: new Date(),
          ipv4,
          reason,
          agent,
          role
        },
      });
      console.log("Log entry created successfully");
    } catch (error) {
      console.error("Error creating log entry:", error);
    }
  };
  
  export default {
    createLogEntry,
  };
  