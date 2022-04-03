export const memoryFlags = {
	// see: https://docs.microsoft.com/en-gb/windows/desktop/Memory/memory-protection-constants
	access: {
		PAGE_NOACCESS: 0x01,
		PAGE_READONLY: 0x02,
		PAGE_READWRITE: 0x04,
		PAGE_WRITECOPY: 0x08,
		PAGE_EXECUTE: 0x10,
		PAGE_EXECUTE_READ: 0x20,
		PAGE_EXECUTE_READWRITE: 0x40,
		PAGE_EXECUTE_WRITECOPY: 0x80,
		PAGE_GUARD: 0x100,
		PAGE_NOCACHE: 0x200,
		PAGE_WRITECOMBINE: 0x400,
		PAGE_ENCLAVE_UNVALIDATED: 0x20000000,
		PAGE_TARGETS_NO_UPDATE: 0x40000000,
		PAGE_TARGETS_INVALID: 0x40000000,
		PAGE_ENCLAVE_THREAD_CONTROL: 0x80000000,
	},

	// see: https://docs.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualallocex#parameters
	allocation: {
		MEM_COMMIT: 0x00001000,
		MEM_RESERVE: 0x00002000,
		MEM_RESET: 0x00080000,
		MEM_TOP_DOWN: 0x00100000,
		MEM_RESET_UNDO: 0x1000000,
		MEM_LARGE_PAGES: 0x20000000,
		MEM_PHYSICAL: 0x00400000,
	},

	// see: https://docs.microsoft.com/en-us/windows/desktop/api/winnt/ns-winnt-_memory_basic_information
	page: {
		MEM_PRIVATE: 0x20000,
		MEM_MAPPED: 0x40000,
		MEM_IMAGE: 0x1000000,
	},
};

export const hardwareDebug = {
	registers: {
		DR0: 0x0,
		DR1: 0x1,
		DR2: 0x2,
		DR3: 0x3,
	},
	breakpointTriggerTypes: {
		TRIGGER_EXECUTE: 0x0,
		TRIGGER_ACCESS: 0x3,
		TRIGGER_WRITE: 0x1,
	},
};
