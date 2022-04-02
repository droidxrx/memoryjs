import fs from 'fs';
import constants from './consts';
import Debugger from './debugger';
import memoryjs, { dataType, flagsTypes, getReturnType, processId, processName, writeValue } from './memoryjs';
import { STRUCTRON_TYPE_STRING } from './utils';

/** 1=T_STRING | 4=T_INT | 6=T_FLOAT */
type aTypes = 1 | 4 | 6;
/** 0=T_VOID | 1=T_STRING | 2=T_CHAR | 3=T_BOOL | 4=T_INT | 5=T_DOUBLE | 6=T_FLOAT */
type rTypes = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type argsFun<T> = { type: T; value: T extends 0x1 ? string : number }[];
type callFunctionReturn<T> = { returnValue: T extends 0 | 4 | 5 | 6 ? number : T extends 1 | 2 ? string : T extends 3 ? boolean : unknown; exitCode: number };

const signatureTypes = {
	NORMAL: 0x0,
	READ: 0x1,
	SUBTRACT: 0x2,
};

type protectionType = keyof typeof constants.memoryFlags.access;
type allocationType = keyof typeof constants.memoryFlags.allocation;

const library = {
	openProcess(processIdentifier: processName | processId) {
		return memoryjs.openProcess(processIdentifier);
	},
	closeProcess(handle: number) {
		memoryjs.closeProcess(handle);
	},
	getProcesses() {
		return memoryjs.getProcesses();
	},
	findModule(moduleName: string, processId: number) {
		return memoryjs.findModule(moduleName, processId);
	},
	getModules(processId: number) {
		return memoryjs.getModules(processId);
	},
	readMemory<T extends dataType>(handle: number, address: number, dataType: T): getReturnType<T> {
		return memoryjs.readMemory(handle, address, dataType);
	},
	readBuffer(handle: number, address: number, size: number) {
		return memoryjs.readBuffer(handle, address, size);
	},
	writeMemory(handle: number, address: number, value: writeValue, dataType: dataType) {
		if (dataType === 'str' || dataType === 'string') value += '\0'; // add terminator
		memoryjs.writeMemory(handle, address, value, dataType);
	},
	writeBuffer(handle: number, address: number, buffer: Buffer) {
		memoryjs.writeBuffer(handle, address, buffer);
	},
	findPattern(handle: number, pattern: string, flags: flagsTypes, patternOffset: number) {
		return memoryjs.findPattern(handle, pattern, signatureTypes[flags], patternOffset);
	},
	findPatternByModule(handle: number, moduleName: string, pattern: string, flags: flagsTypes, patternOffset: number) {
		return memoryjs.findPatternByModule(handle, moduleName, pattern, signatureTypes[flags], patternOffset);
	},
	findPatternByAddress(handle: number, baseAddress: number, pattern: string, flags: flagsTypes, patternOffset: number) {
		return memoryjs.findPatternByAddress(handle, baseAddress, pattern, signatureTypes[flags], patternOffset);
	},
	callFunction<T extends aTypes, E extends rTypes>(handle: number, args: argsFun<T>, returnType: E, address: number): callFunctionReturn<E> {
		return memoryjs.callFunction(handle, args, returnType, address);
	},
	virtualAllocEx(handle: number, address: number, size: number, allocation: allocationType, protection: protectionType) {
		return memoryjs.virtualAllocEx(handle, address, size, constants.memoryFlags.allocation[allocation], constants.memoryFlags.access[protection]);
	},
	virtualProtectEx(handle: number, address: number, size: number, protection: protectionType) {
		return memoryjs.virtualProtectEx(handle, address, size, constants.memoryFlags.access[protection]);
	},
	getRegions(handle: number) {
		return memoryjs.getRegions(handle);
	},
	virtualQueryEx(handle: number, address: number) {
		return memoryjs.virtualQueryEx(handle, address);
	},
	attachDebugger(processId: number, killOnExit: boolean) {
		return memoryjs.attachDebugger(processId, killOnExit);
	},
	detatchDebugger(processId: number) {
		return memoryjs.detatchDebugger(processId);
	},
	awaitDebugEvent(hardwareRegister: number, millisTimeout: number) {
		return memoryjs.awaitDebugEvent(hardwareRegister, millisTimeout);
	},
	handleDebugEvent(processId: number, threadId: number) {
		return memoryjs.handleDebugEvent(processId, threadId);
	},
	setHardwareBreakpoint(processId: number, address: number, hardwareRegister: number, trigger: number, length: number) {
		return memoryjs.setHardwareBreakpoint(processId, address, hardwareRegister, trigger, length);
	},
	removeHardwareBreakpoint(processId: number, hardwareRegister: number) {
		return memoryjs.removeHardwareBreakpoint(processId, hardwareRegister);
	},
	injectDll(handle: number, dllPath: string) {
		if (!dllPath.endsWith('.dll')) throw new Error("Given path is invalid: file is not of type 'dll'.");
		if (!fs.existsSync(dllPath)) throw new Error('Given path is invaild: file does not exist.');
		return memoryjs.injectDll(handle, dllPath);
	},
	unloadDll(handle: number, moduleBaseAddressOrName: string | number) {
		return memoryjs.unloadDll(handle, moduleBaseAddressOrName);
	},
	Debugger: new Debugger(memoryjs),
};

export default {
	...library,
	STRUCTRON_TYPE_STRING: STRUCTRON_TYPE_STRING(memoryjs),
};
