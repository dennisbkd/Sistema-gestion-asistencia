<?php

namespace App\Http\Controllers;

use App\Models\Aula;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AulaController extends Controller
{
    public function index()
    {
        $aulas = Aula::latest()->get();

        return inertia('aula/Index', [
            'classrooms' => $aulas,
        ]);
    }

    public function create()
    {
        return inertia('aula/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigoAula' => 'required|string|max:20|unique:aulas,codigoAula',
            'capacidad' => 'required|integer|min:1',
            'tipo' => 'required|string|max:50',
            'activo' => 'boolean',
        ]);

        Aula::create($validated);

        return redirect()->route('aula.Index')
            ->with('success', 'Aula registrada exitosamente');
    }

    public function show(Aula $classroom)
    {
        return inertia('aula/Show', [
            'classroom' => $classroom,
        ]);
    }

    public function edit(Aula $classroom)
    {
        return inertia('aula/Edit', [
            'classroom' => $classroom,
        ]);
    }

    public function update(Request $request, Aula $classroom)
    {
        $validated = $request->validate([
            'codigoAula' => 'required|string|max:20|unique:aulas,codigoAula,' . $classroom->id,
            'capacidad' => 'required|integer|min:1',
            'tipo' => 'required|string|max:50',
            'activo' => 'boolean',
        ]);

        $classroom->update($validated);

        return redirect()->route('aula.Index')
            ->with('success', 'Aula actualizada exitosamente');
    }

    public function destroy(Aula $classroom)
    {
        $classroom->delete();

        return redirect()->route('aula.Index')
            ->with('success', 'Aula eliminada exitosamente');
    }
}