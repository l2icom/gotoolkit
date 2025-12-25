export interface AIAgent {
    id: string;
    name: string;
    description: string;
    capabilities: string[];
    
    executeTask(task: AITask, context: AIContext): Promise<AIReturn>;
    canHandleTask(task: AITask): boolean;
    
    getMemory(): AIMemory;
    updateMemory(key: string, value: any): void;
}

export interface AITask {
    id: string;
    type: string;
    description: string;
    parameters: Record<string, any>;
    priority: number;
}

export interface AIContext {
    conversationId: string;
    userId: string;
    sessionData: Record<string, any>;
    currentState: Record<string, any>;
}

export interface AIReturn {
    success: boolean;
    result: any;
    error?: Error;
    metadata: Record<string, any>;
}

export interface AIMemory {
    shortTerm: Map<string, any>;
    longTerm: Map<string, any>;
    
    remember(key: string, value: any, type: 'short' | 'long'): void;
    recall(key: string): any | undefined;
    forget(key: string): void;
    clear(type?: 'short' | 'long'): void;
}

export abstract class BaseAgent implements AIAgent {
    id: string;
    name: string;
    description: string;
    capabilities: string[];
    protected memory: AIMemory;
    
    constructor(id: string, name: string, description: string, capabilities: string[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.capabilities = capabilities;
        this.memory = new BasicMemory();
    }
    
    abstract executeTask(task: AITask, context: AIContext): Promise<AIReturn>;
    
    canHandleTask(task: AITask): boolean {
        return this.capabilities.includes(task.type);
    }
    
    getMemory(): AIMemory {
        return this.memory;
    }
    
    updateMemory(key: string, value: any): void {
        this.memory.remember(key, value, 'short');
    }
}

export class BasicMemory implements AIMemory {
    shortTerm: Map<string, any>;
    longTerm: Map<string, any>;
    
    constructor() {
        this.shortTerm = new Map();
        this.longTerm = new Map();
    }
    
    remember(key: string, value: any, type: 'short' | 'long' = 'short'): void {
        if (type === 'short') {
            this.shortTerm.set(key, value);
        } else {
            this.longTerm.set(key, value);
        }
    }
    
    recall(key: string): any | undefined {
        // Check long-term memory first, then short-term
        if (this.longTerm.has(key)) {
            return this.longTerm.get(key);
        }
        return this.shortTerm.get(key);
    }
    
    forget(key: string): void {
        this.shortTerm.delete(key);
        this.longTerm.delete(key);
    }
    
    clear(type?: 'short' | 'long'): void {
        if (!type) {
            this.shortTerm.clear();
            this.longTerm.clear();
        } else if (type === 'short') {
            this.shortTerm.clear();
        } else {
            this.longTerm.clear();
        }
    }
}