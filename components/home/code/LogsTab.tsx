"use client"

import { logData } from "@/constants"
import { motion } from "framer-motion"
import { v4 as uuid } from 'uuid';

const LogsTab = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white rounded-lg shadow-sm">
        <div className="font-mono text-sm leading-relaxed text-gray-800">
          {logData?.map((log) => (
            <div key={uuid()} className="hover:bg-gray-50 py-1 transition-colors break-all">
              {`${log.timestamp} "${log.method} ${log.path}" ${log.status} "${log.message}"`}
            </div>
          ))}
        </div>
    </motion.div>
  )
}

export default LogsTab

