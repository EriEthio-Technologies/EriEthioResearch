import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// In a production environment, you would use a secure code execution service
// For now, we'll simulate code execution
async function executeCode(code: string, language: string, input?: string): Promise<string> {
  // This is just a simulation
  // In production, you would:
  // 1. Use a sandboxed environment
  // 2. Set resource limits (CPU, memory, time)
  // 3. Handle various languages
  // 4. Properly capture stdout/stderr
  // 5. Implement proper error handling
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate output
      resolve(`Output for ${language} code:\n${code}\n\nInput: ${input || 'None'}`);
    }, 1000);
  });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, language, testCases, mode } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Execute code with test cases
    const results = await Promise.all(
      (testCases || []).map(async (testCase: any) => {
        const output = await executeCode(code, language, testCase.input);
        const passed = output.includes(testCase.expected_output);

        return {
          passed,
          input: testCase.hidden ? '[Hidden]' : testCase.input,
          expected: testCase.hidden ? '[Hidden]' : testCase.expected_output,
          actual: testCase.hidden ? '[Hidden]' : output,
        };
      })
    );

    // If this is a submission, save the results
    if (mode === 'submit') {
      const allPassed = results.every(r => r.passed);
      const score = Math.round((results.filter(r => r.passed).length / results.length) * 100);

      // Save submission results
      const { error: submissionError } = await supabase
        .from('user_assignments')
        .insert({
          user_id: session.user.id,
          assignment_id: body.assignmentId,
          submission_code: code,
          status: 'submitted',
          grade: score,
          test_results: results,
          submitted_at: new Date().toISOString()
        });

      if (submissionError) throw submissionError;

      // If all tests passed, award any relevant badges
      if (allPassed) {
        // Check for badge criteria
        const { data: badges } = await supabase
          .from('badges')
          .select('*')
          .eq('category', 'assignment_completion');

        for (const badge of badges || []) {
          const criteria = badge.criteria as any;
          if (criteria.assignment_id === body.assignmentId) {
            // Award badge
            await supabase
              .from('user_badges')
              .insert({
                user_id: session.user.id,
                badge_id: badge.id
              })
              .single();
          }
        }
      }
    }

    return NextResponse.json({
      output: 'Code executed successfully',
      testResults: results
    });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 