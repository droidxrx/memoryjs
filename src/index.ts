import fs from 'fs';
import { memoryFlags } from './consts';
import Debugger from './debugger';
import Memoryjs, { dataType, flagsTypes, getReturnType, processId, processName, writeValue } from './memoryjs';
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

type protectionType = keyof typeof memoryFlags.access;
type allocationType = keyof typeof memoryFlags.allocation;

const library = {
	openProcess(processIdentifier: processName | processId) {
		return Memoryjs.openProcess(processIdentifier);
	},
	closeProcess(handle: number) {
		Memoryjs.closeProcess(handle);
	},
	getProcesses() {
		return Memoryjs.getProcesses();
	},
	findModule(moduleName: string, processId: number) {
		return Memoryjs.findModule(moduleName, processId);
	},
	getModules(processId: number) {
		return Memoryjs.getModules(processId);
	},
	readMemory<T extends dataType>(handle: number, address: number, dataType: T): getReturnType<T> {
		return Memoryjs.readMemory(handle, address, dataType);
	},
	readBuffer(handle: number, address: number, size: number) {
		return Memoryjs.readBuffer(handle, address, size);
	},
	writeMemory(handle: number, address: number, value: writeValue, dataType: dataType) {
		if (dataType === 'str' || dataType === 'string') value += '\0'; // add terminator
		Memoryjs.writeMemory(handle, address, value, dataType);
	},
	writeBuffer(handle: number, address: number, buffer: Buffer) {
		Memoryjs.writeBuffer(handle, address, buffer);
	},
	findPattern(handle: number, pattern: string, flags: flagsTypes, patternOffset: number) {
		return Memoryjs.findPattern(handle, pattern, signatureTypes[flags], patternOffset);
	},
	findPatternByModule(handle: number, moduleName: string, pattern: string, flags: flagsTypes, patternOffset: number) {
		return Memoryjs.findPatternByModule(handle, moduleName, pattern, signatureTypes[flags], patternOffset);
	},
	findPatternByAddress(handle: number, baseAddress: number, pattern: string, flags: flagsTypes, patternOffset: number) {
		return Memoryjs.findPatternByAddress(handle, baseAddress, pattern, signatureTypes[flags], patternOffset);
	},
	callFunction<T extends aTypes, E extends rTypes>(handle: number, args: argsFun<T>, returnType: E, address: number): callFunctionReturn<E> {
		return Memoryjs.callFunction(handle, args, returnType, address);
	},
	virtualAllocEx(handle: number, address: number, size: number, allocation: allocationType, protection: protectionType) {
		return Memoryjs.virtualAllocEx(handle, address, size, memoryFlags.allocation[allocation], memoryFlags.access[protection]);
	},
	virtualProtectEx(handle: number, address: number, size: number, protection: protectionType) {
		return Memoryjs.virtualProtectEx(handle, address, size, memoryFlags.access[protection]);
	},
	getRegions(handle: number) {
		return Memoryjs.getRegions(handle);
	},
	virtualQueryEx(handle: number, address: number) {
		return Memoryjs.virtualQueryEx(handle, address);
	},
	attachDebugger(processId: number, killOnExit: boolean) {
		return Memoryjs.attachDebugger(processId, killOnExit);
	},
	detatchDebugger(processId: number) {
		return Memoryjs.detatchDebugger(processId);
	},
	awaitDebugEvent(hardwareRegister: number, millisTimeout: number) {
		return Memoryjs.awaitDebugEvent(hardwareRegister, millisTimeout);
	},
	handleDebugEvent(processId: number, threadId: number) {
		return Memoryjs.handleDebugEvent(processId, threadId);
	},
	setHardwareBreakpoint(processId: number, address: number, hardwareRegister: number, trigger: number, length: number) {
		return Memoryjs.setHardwareBreakpoint(processId, address, hardwareRegister, trigger, length);
	},
	removeHardwareBreakpoint(processId: number, hardwareRegister: number) {
		return Memoryjs.removeHardwareBreakpoint(processId, hardwareRegister);
	},
	injectDll(handle: number, dllPath: string) {
		if (!dllPath.endsWith('.dll')) throw new Error("Given path is invalid: file is not of type 'dll'.");
		if (!fs.existsSync(dllPath)) throw new Error('Given path is invaild: file does not exist.');
		return Memoryjs.injectDll(handle, dllPath);
	},
	unloadDll(handle: number, moduleBaseAddressOrName: string | number) {
		return Memoryjs.unloadDll(handle, moduleBaseAddressOrName);
	},
};

export type Library = typeof library;

export default {
	...library,
	Debugger: new Debugger(library),
	STRUCTRON_TYPE_STRING: STRUCTRON_TYPE_STRING(library),
};
