// Simple test for the AI Agent Integration

import { getGoToolkitAgentIntegration } from './integration-example';

export async function testAgentIntegration(): Promise<void> {
    console.log('Starting AI Agent Integration Test...');
    
    try {
        // Get the integration instance
        const integration = getGoToolkitAgentIntegration();
        
        console.log('✓ Integration instance created');
        
        // Test 1: Check available tools
        const tools = integration.getAvailableTools();
        console.log(`✓ Available tools: ${tools.length}`);
        tools.forEach(tool => {
            console.log(`  - ${tool.name}: ${tool.description}`);
        });
        
        // Test 2: Check available agents
        const agents = integration.getAvailableAgents();
        console.log(`✓ Available agents: ${agents.length}`);
        agents.forEach(agentId => {
            const capabilities = integration.getAgentCapabilities(agentId);
            console.log(`  - ${agentId}: ${capabilities?.join(', ') || 'no capabilities'}`);
        });
        
        // Test 3: Generate simple content
        console.log('\nTesting content generation...');
        const contentResult = await integration.generateContent(
            'Generate a short summary about AI agent patterns',
            'Write a concise summary about {{prompt}} in 2-3 sentences.'
        );
        
        if (contentResult.success) {
            console.log('✓ Content generation successful:');
            console.log(`  "${contentResult.result.content}"`);
        } else {
            console.log('✗ Content generation failed:', contentResult.error?.message);
        }
        
        // Test 4: Execute a tool directly
        console.log('\nTesting tool execution...');
        try {
            const toolResult = await integration.executeTool('content-generator', {
                prompt: 'Explain the benefits of agentic patterns in AI systems'
            });
            console.log('✓ Tool execution successful:');
            console.log(`  "${toolResult.content}"`);
        } catch (toolError) {
            console.log('✗ Tool execution failed:', toolError.message);
        }
        
        // Test 5: Data analysis tool
        console.log('\nTesting data analysis...');
        try {
            const dataResult = await integration.executeTool('data-analyzer', {
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                analysisType: 'summary'
            });
            console.log('✓ Data analysis successful:');
            console.log(`  ${JSON.stringify(dataResult, null, 2)}`);
        } catch (dataError) {
            console.log('✗ Data analysis failed:', dataError.message);
        }
        
        console.log('\n🎉 All tests completed!');
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test if in a browser environment
if (typeof window !== 'undefined') {
    // Expose test function to window for manual testing
    (window as any).testGoToolkitAgentIntegration = testAgentIntegration;
    
    // Auto-run test after a short delay to allow page load
    setTimeout(() => {
        console.log('Running AI Agent Integration Test...');
        testAgentIntegration();
    }, 2000);
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testAgentIntegration };
}