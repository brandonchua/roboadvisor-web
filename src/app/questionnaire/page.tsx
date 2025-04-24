// src/app/questionnaire/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebug } from '../providers/DebugProvider';
import questions from '../../data/questionnaire.json';
import { computeRawScore, computeRiskAversion } from '../../lib/risk';
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col
} from 'react-bootstrap';

export default function Questionnaire() {
  const { debug } = useDebug();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const router = useRouter();

  const handleChange = (id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // compute raw score and aversion
    const raw = computeRawScore(answers);
    const A   = computeRiskAversion(answers);

    // only log the final A value
    console.log('🗝️ Final computed risk aversion A =', A);

    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('❌ API error:', errText);
        alert('Server error—check console');
        return;
      }

      const { weights } = await res.json();
      router.push(
        `/recommendation?answers=${encodeURIComponent(JSON.stringify(answers))}`
      );
    } catch (err) {
      console.error('⚠️ Network error:', err);
      alert('Network error—check console');
    }
  };

  // for the optional DEBUG panel
  const raw = computeRawScore(answers);
  const A   = computeRiskAversion(answers);

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <Card.Title as="h2" className="mb-4">
            Risk Profile Survey
          </Card.Title>

          {debug && (
            <div className="mb-4 px-3 py-2 bg-red-50 border-l-4 border-red-400">
              <strong>DEBUG:</strong> raw={raw}, A={A}
            </div>
          )}

          <Form onSubmit={onSubmit}>
            {questions.map(q => (
              <Form.Group key={q.id} className="mb-4" controlId={q.id}>
                <Form.Label>{q.text}</Form.Label>

                {q.type === 'single' ? (
                  <Form.Select
                    value={answers[q.id] || ''}
                    onChange={e => handleChange(q.id, e.target.value)}
                  >
                    <option value="">Choose…</option>
                    {q.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                ) : (
                  <Row>
                    {q.options.map(opt => {
                      const picked =
                        Array.isArray(answers[q.id]) &&
                        answers[q.id].includes(opt);
                      return (
                        <Col xs="auto" key={opt}>
                          <Form.Check
                            type="checkbox"
                            label={opt}
                            checked={picked}
                            onChange={e => {
                              const prev = (answers[q.id] as string[]) || [];
                              handleChange(
                                q.id,
                                e.target.checked
                                  ? [...prev, opt]
                                  : prev.filter(x => x !== opt)
                              );
                            }}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </Form.Group>
            ))}

            <Button variant="primary" type="submit" className="w-100">
              Continue
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}