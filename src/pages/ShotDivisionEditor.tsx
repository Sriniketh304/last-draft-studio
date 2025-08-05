import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ShotRow {
  id: string;
  refNo: string;
  shotNo: string;
  intExt: string;
  shot: string;
  cameraAngle: string;
  cameraMove: string;
  subject: string;
  description: string;
}

export const ShotDivisionEditor = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ShotRow[]>([
    {
      id: '1',
      refNo: '1',
      shotNo: '1',
      intExt: 'INT',
      shot: '',
      cameraAngle: '',
      cameraMove: '',
      subject: '',
      description: '',
    }
  ]);

  const addRow = () => {
    const newRow: ShotRow = {
      id: Date.now().toString(),
      refNo: (rows.length + 1).toString(),
      shotNo: (rows.length + 1).toString(),
      intExt: 'INT',
      shot: '',
      cameraAngle: '',
      cameraMove: '',
      subject: '',
      description: '',
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: keyof ShotRow, value: string) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const saveShotDivision = () => {
    // TODO: Implement save functionality
    console.log("Saving shot division:", rows);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/shotdivision')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Shot Division</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="cinematic" onClick={addRow}>
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
            <Button variant="hero" onClick={saveShotDivision}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Shot Division Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[80px]">Script/SB Ref.</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[60px]">Shot #</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[80px]">Interior Exterior</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[60px]">Shot</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[90px]">Camera Angle</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[90px]">Camera Move</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[60px]">Audio</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[120px]">Subject</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[200px]">Description of Shot</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border border-gray-300 min-w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.refNo}
                        onChange={(e) => updateRow(row.id, 'refNo', e.target.value)}
                        className="w-full h-full bg-white border-0 outline-none text-xs text-black px-2 py-2 min-h-[40px]"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.shotNo}
                        onChange={(e) => updateRow(row.id, 'shotNo', e.target.value)}
                        className="w-full h-full bg-white border-0 outline-none text-xs text-black px-2 py-2 min-h-[40px]"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <select
                        value={row.intExt}
                        onChange={(e) => updateRow(row.id, 'intExt', e.target.value)}
                        className="w-full h-full bg-white border-0 outline-none text-xs text-black px-2 py-2 min-h-[40px]"
                      >
                        <option value="INT">Interior</option>
                        <option value="EXT">Exterior</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.shot}
                        onChange={(e) => updateRow(row.id, 'shot', e.target.value)}
                        className="w-full h-full bg-white border-0 outline-none text-xs text-black px-2 py-2 min-h-[40px]"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.cameraAngle}
                        onChange={(e) => updateRow(row.id, 'cameraAngle', e.target.value)}
                        className="w-full h-full bg-white border-0 outline-none text-xs text-black px-2 py-2 min-h-[40px]"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.cameraMove}
                        onChange={(e) => updateRow(row.id, 'cameraMove', e.target.value)}
                        className="w-full h-full bg-white border-0 outline-none text-xs text-black px-2 py-2 min-h-[40px]"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value=""
                        onChange={() => {}}
                        className="w-full h-full bg-white border-0 outline-none text-xs text-black px-2 py-2 min-h-[40px]"
                        placeholder="VO"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <textarea
                        value={row.subject}
                        onChange={(e) => updateRow(row.id, 'subject', e.target.value)}
                        className="w-full h-full bg-white border-0 outline-none text-xs text-black px-2 py-2 resize-none min-h-[40px]"
                        rows={3}
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <textarea
                        value={row.description}
                        onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                        className="w-full h-full bg-white border-0 outline-none text-xs text-black px-2 py-2 resize-none min-h-[40px]"
                        rows={3}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRow(row.id)}
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};