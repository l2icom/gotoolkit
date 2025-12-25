// Integration example showing how to use the AI Agent system with GoToolkit

import { AgentOrchestrator } from './agent-orchestrator';
import { ContentGenerationAgent } from './content-agent';
import { ToolRegistry, ContentGenerationTool, DataAnalysisTool } from './tool-registry';

export class GoToolkitAgentIntegration {
    private orchestrator: AgentOrchestrator;
    private toolRegistry: ToolRegistry;
    
    constructor() {
        this.orchestrator = new AgentOrchestrator();
        this.toolRegistry = new ToolRegistry();
        
        // Register tools
        this.setupTools();
        
        // Register agents
        this.setupAgents();
    }
    
    private setupTools(): void {
        // Register built-in tools
        this.toolRegistry.registerTool(new ContentGenerationTool());
        this.toolRegistry.registerTool(new DataAnalysisTool());
        
        // Additional tools could be registered here
    }
    
    private setupAgents(): void {
        // Register content generation agent
        const contentAgent = new ContentGenerationAgent();
        this.orchestrator.registerAgent(contentAgent);
        this.orchestrator.setDefaultAgent(contentAgent.id);
        
        // Additional agents could be registered here
    }
    
    getAvailableTools(): any[] {
        return this.toolRegistry.getToolDescriptions();
    }
    
    getAvailableAgents(): string[] {
        return this.orchestrator.getAvailableAgents();
    }
    
    async generateContent(prompt: string, template?: string, contextData?: any): Promise<any> {
        // Create a content generation task
        const task = {
            id: `content_${Date.now()}`,
            type: 'content-generation',
            description: 'Generate content based on user input',
            parameters: {
                prompt: prompt,
                template: template,
                contextData: contextData,
                outputFormat: 'structured'
            },
            priority: 1
        };
        
        // Create a basic context
        const aiContext = {
            conversationId: 'integration_example',
            userId: 'system',
            sessionData: {},
            currentState: {}
        };
        
        // Execute the task
        return this.orchestrator.executeTask(task, aiContext);
    }
    
    async executeTool(toolId: string, params: any): Promise<any> {
        return this.toolRegistry.executeTool(toolId, params);
    }
    
    // Example: Generate content using a GoToolkit template
    async generateFromTemplate(templateId: string, data: any): Promise<any> {
        const contentAgent = this.orchestrator.getAgent('content-generator');
        
        if (!contentAgent || !(contentAgent instanceof ContentGenerationAgent)) {
            throw new Error('Content generation agent not available');
        }
        
        // Create a basic context
        const aiContext = {
            conversationId: `template_${Date.now()}`,
            userId: 'system',
            sessionData: {},
            currentState: {}
        };
        
        return contentAgent.generateFromTemplate(templateId, data, aiContext);
    }
    
    // Helper method to get agent capabilities
    getAgentCapabilities(agentId: string): string[] | undefined {
        return this.orchestrator.getAgentCapabilities(agentId);
    }
}

// Singleton instance for easy access
let integrationInstance: GoToolkitAgentIntegration | null = null;

export function getGoToolkitAgentIntegration(): GoToolkitAgentIntegration {
    if (!integrationInstance) {
        integrationInstance = new GoToolkitAgentIntegration();
    }
    return integrationInstance;
}

// Expose to window for use in browser context
if (typeof window !== 'undefined') {
    (window as any).GoToolkitAgentIntegration = {
        getInstance: getGoToolkitAgentIntegration
    };
}