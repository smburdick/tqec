from typing import Literal

from tqec.compile.specs.library.generators.utils import PlaquetteMapper
from tqec.plaquette.compilation.base import PlaquetteCompiler
from tqec.plaquette.rpng.rpng import RPNGDescription
from tqec.plaquette.rpng.translators.base import RPNGTranslator
from tqec.utils.enums import Basis, Orientation


class UniformScheduleConventionGenerator:
    def __init__(self, translator: RPNGTranslator, compiler: PlaquetteCompiler):
        """Low-level helper class centralising all the plaquette creation for the fixed boundary
        convention.

        This class provides all the methods needed to return the appropriate templates and
        plaquettes needed to implement low-level QEC layers using the fixed boundary convention.

        """
        self._mapper = PlaquetteMapper(translator, compiler)

    def get_uniform_rpng_descriptions(
        self,
        is_reversed: bool,
        reset: Basis | None = None,
        measurement: Basis | None = None,
        reset_and_measured_indices: tuple[Literal[0, 1, 2, 3], ...] = (0, 1, 2, 3),
    ) -> dict[Basis, dict[Orientation, RPNGDescription]]:
        """Docstring."""
        pass
