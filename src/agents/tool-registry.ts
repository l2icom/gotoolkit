export interface AITool {
    id: string;
    name: string;
    description: string;
    parameters: Record<string, {
        name: string;
        type: string;
        description: string;
        required: boolean;
    }>;
    
    execute(params: Record<string, any>): Promise<any>;
}

export class ToolRegistry {
    private tools: Map<string, AITool>;
    
    constructor() {
        this.tools = new Map();
    }
    
    registerTool(tool: AITool): void {
        if (this.tools.has(tool.id)) {
            console.warn(`Tool with ID ${tool.id} already registered`);
            return;
        }
        this.tools.set(tool.id, tool);
    }
    
    getTool(toolId: string): AITool | undefined {
        return this.tools.get(toolId);
    }
    
    getAllTools(): AITool[] {
        return Array.from(this.tools.values());
    }
    
    async executeTool(toolId: string, params: Record<string, any>): Promise<any> {
        const tool = this.getTool(toolId);
        if (!tool) {
            throw new Error(`Tool ${toolId} not found`);
        }
        
        // Validate parameters
        this.validateParameters(tool, params);
        
        try {
            return await tool.execute(params);
        } catch (error) {
            console.error(`Tool ${toolId} execution failed:`, error);
            throw error;
        }
    }
    
    private validateParameters(tool: AITool, params: Record<string, any>): void {
        const errors: string[] = [];
        
        // Check required parameters
        for (const [paramName, paramDef] of Object.entries(tool.parameters)) {
            if (paramDef.required && params[paramName] === undefined) {
                errors.push(`Missing required parameter: ${paramName}`);
            }
        }
        
        // Check for extra parameters
        const validParamNames = Object.keys(tool.parameters);
        for (const paramName in params) {
            if (!validParamNames.includes(paramName)) {
                errors.push(`Unexpected parameter: ${paramName}`);
            }
        }
        
        if (errors.length > 0) {
            throw new Error(`Parameter validation failed: ${errors.join(', ')}`);
        }
    }
    
    getToolDescriptions(): Record<string, any>[] {
        return Array.from(this.tools.values()).map(tool => ({
            id: tool.id,
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
        }));
    }
}

// Example tools that can be used with the existing GoToolkit system

export class ContentGenerationTool implements AITool {
    id = 'content-generator';
    name = 'Content Generator';
    description = 'Generates structured content based on prompts and templates';
    
    parameters = {
        prompt: {
            name: 'prompt',
            type: 'string',
            description: 'The main prompt for content generation',
            required: true
        },
        template: {
            name: 'template',
            type: 'string',
            description: 'Optional template to use for generation',
            required: false
        },
        context: {
            name: 'context',
            type: 'object',
            description: 'Additional context data as JSON object',
            required: false
        }
    };
    
    async execute(params: Record<string, any>): Promise<any> {
        // This would integrate with the existing GoToolkitIA system
        const goToolkitIA = (window as any).GoToolkitIA;
        
        if (!goToolkitIA) {
            throw new Error('GoToolkitIA not available');
        }
        
        const prompt = params.template
            ? params.template.replace('{{prompt}}', params.prompt)
            : params.prompt;
        
        const result = await goToolkitIA.chatCompletion({
            payload: {
                messages: [
                    { role: 'system', content: 'You are a helpful content generation assistant.' },
                    { role: 'user', content: prompt }
                ],
                stream: false
            }
        });
        
        return {
            content: result,
            format: 'text'
        };
    }
}

export class DataAnalysisTool implements AITool {
    id = 'data-analyzer';
    name = 'Data Analyzer';
    description = 'Analyzes structured data and provides insights';
    
    parameters = {
        data: {
            name: 'data',
            type: 'object',
            description: 'Data to analyze as JSON object or array',
            required: true
        },
        analysisType: {
            name: 'analysisType',
            type: 'string',
            description: 'Type of analysis to perform (summary, trends, outliers)',
            required: false
        }
    };
    
    async execute(params: Record<string, any>): Promise<any> {
        // Simple data analysis - would be enhanced with actual AI analysis
        const data = params.data;
        const analysisType = params.analysisType || 'summary';
        
        if (!data) {
            throw new Error('No data provided for analysis');
        }
        
        // Basic analysis based on data type
        if (Array.isArray(data)) {
            return this.analyzeArrayData(data, analysisType);
        } else if (typeof data === 'object') {
            return this.analyzeObjectData(data, analysisType);
        } else {
            return {
                analysis: 'Unsupported data format',
                type: analysisType,
                data: data
            };
        }
    }
    
    private analyzeArrayData(data: any[], analysisType: string): any {
        if (data.length === 0) {
            return { analysis: 'Empty dataset', type: analysisType };
        }
        
        switch (analysisType) {
            case 'summary':
                return {
                    type: 'array_summary',
                    count: data.length,
                    firstItem: data[0],
                    lastItem: data[data.length - 1],
                    sample: data.slice(0, 3)
                };
            case 'trends':
                // Simple trend analysis
                return {
                    type: 'array_trends',
                    dataPreview: data.slice(0, 5)
                };
            default:
                return {
                    type: 'array_analysis',
                    data: data
                };
        }
    }
    
    private analyzeObjectData(data: any, analysisType: string): any {
        const keys = Object.keys(data);
        
        switch (analysisType) {
            case 'summary':
                return {
                    type: 'object_summary',
                    keyCount: keys.length,
                    keys: keys,
                    sampleData: this.getSampleObjectData(data, keys)
                };
            default:
                return {
                    type: 'object_analysis',
                    data: data
                };
        }
    }
    
    private getSampleObjectData(data: any, keys: string[]): any {
        const sample: any = {};
        const sampleKeys = keys.slice(0, 3); // First 3 keys
        
        for (const key of sampleKeys) {
            sample[key] = data[key];
        }
        
        return sample;
    }
}