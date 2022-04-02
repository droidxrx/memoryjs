type dataTypeNum = 'byte' | 'int' | 'int32' | 'uint32' | 'int64' | 'uint64' | 'dword' | 'short' | 'long' | 'float' | 'double' | 'ptr' | 'pointer';
type dataTypeBool = 'bool' | 'boolean';
type dataTypeStr = 'string' | 'str';
type dataTypeVec2 = 'vector2' | 'vec2';
type dataTypeVec3 = 'vector3' | 'vec3';
type dataTypeVec4 = 'vector4' | 'vec4';
export type dataType = dataTypeNum | dataTypeBool | dataTypeStr | dataTypeVec2 | dataTypeVec3 | dataTypeVec4;
export type getReturnType<T extends dataType> = T extends dataTypeNum ? number : T extends dataTypeBool ? boolean : T extends dataTypeStr ? string : T extends dataTypeVec2 ? Vector2 : T extends dataTypeVec3 ? Vector3 : T extends dataTypeVec4 ? Vector4: unknown; // prettier-ignore
export type writeValue = number | boolean | string | Vector2 | Vector3 | Vector4;
export type flagsTypes = 'NORMAL' | 'READ' | 'SUBTRACT';

export type processName = string;
export type processId = number;

export interface Vector2 {
	x: number;
	y: number;
}

export interface Vector3 extends Vector2 {
	z: number;
}

export interface Vector4 extends Vector3 {
	w: number;
}

export interface processInfo {
	dwSize: number;
	th32ProcessID: number;
	cntThreads: number;
	th32ParentProcessID: number;
	pcPriClassBase: number;
	szExeFile: string;
	modBaseAddr: number;
	handle: number;
}

export type processInfos = processInfo[];

export interface moduleInfo {
	modBaseAddr: number;
	modBaseSize: number;
	szExePath: string;
	szModule: string;
	th32ProcessID: number;
	GlblcntUsage: number;
}

export type moduleInfos = moduleInfo[];

export interface regionInfo {
	BaseAddress: number;
	AllocationBase: number;
	AllocationProtect: number;
	RegionSize: number;
	State: number;
	Protect: number;
	Type: number;
}

export interface regionInfos {
	BaseAddress: number;
	AllocationBase: number;
	AllocationProtect: number;
	RegionSize: number;
	State: number;
	Protect: number;
	Type: number;
	szExeFile: null | string;
}

export interface debugEventInfo {
	processId: number;
	threadId: number;
	exceptionCode: number;
	exceptionFlags: number;
	exceptionAddress: number;
	hardwareRegister: number;
}

export interface MemoryJS {
	openProcess(processIdentifier: processName | processId): processInfo;
	getProcesses(): processInfos;
	closeProcess(handle: number): void;
	getModules(processId: number): moduleInfos;
	findModule(moduleName: string, processId: number): moduleInfo;
	readMemory<T extends dataType>(handle: number, address: number, dataType: T): getReturnType<T>;
	readBuffer(handle: number, address: number, size: number): Buffer;
	writeMemory(handle: number, address: number, value: writeValue, dataType: dataType): void;
	writeBuffer(handle: number, address: number, buffer: Buffer): void;
	findPattern(handle: number, pattern: string, flags: number, patternOffset: number): number;
	findPatternByModule(handle: number, moduleName: string, pattern: string, flags: number, patternOffset: number): number;
	findPatternByAddress(handle: number, baseAddress: number, pattern: string, flags: number, patternOffset: number): number;
	virtualProtectEx(handle: number, address: number, size: number, protection: number): number;
	callFunction(handle: number, args: { type: number; value: any }[], returnType: number, address: number): { returnValue: any; exitCode: number };
	virtualAllocEx(handle: number, address: null | number, size: number, allocationType: number, protection: number): number;
	getRegions(handle: number): regionInfos[];
	virtualQueryEx(handle: number, address: number): regionInfo;
	attachDebugger(processId: number, killOnExit: boolean): boolean;
	detatchDebugger(processId: number): boolean;
	awaitDebugEvent(hardwareRegister: number, millisTimeout: number): debugEventInfo | null;
	handleDebugEvent(processId: number, threadId: number): boolean;
	setHardwareBreakpoint(processId: number, address: number, hardwareRegister: number, trigger: number, length: number): boolean;
	removeHardwareBreakpoint(processId: number, hardwareRegister: number): boolean;
	injectDll(handle: number, dllPath: string): boolean;
	unloadDll(handle: number, moduleBaseAddressOrName: string | number): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const memoryjs: MemoryJS = require('../build/Release/memoryjs.node');
export default memoryjs;
