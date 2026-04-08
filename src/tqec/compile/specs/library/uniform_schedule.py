import functools
from typing import override

from tqec.compile.blocks.block import Block
from tqec.compile.specs.base import CubeBuilder, CubeSpec
from tqec.compile.specs.library.generators.uniform_schedule import (
    UniformScheduleConventionGenerator,
)
from tqec.plaquette.compilation.base import PlaquetteCompiler
from tqec.plaquette.rpng.translators.base import RPNGTranslator
from tqec.utils.scale import LinearFunction


class UniformScheduleCubeBuilder(CubeBuilder):
    def __init__(self, compiler: PlaquetteCompiler, translator: RPNGTranslator):
        """Implement uniform scheduling."""
        self._generator = UniformScheduleConventionGenerator(translator, compiler)

    @override
    def __call__(self, spec: CubeSpec, block_temporal_height: LinearFunction) -> Block:
        """Instantiate a :class:`.Block` instance implementing the provided ``spec``."""
        return self._call_impl(spec, block_temporal_height)

    @functools.cache
    def _call_impl(self, spec: CubeSpec, block_temporal_height: LinearFunction) -> Block:
        pass
        # kind = spec.kind
        # if isinstance(kind, Port):
        #     raise TQECError("Cannot build a block for a Port.")
        # elif isinstance(kind, YHalfCube):
        #     raise NotImplementedError("Y cube is not implemented.")
        # template, pgen = self._get_template_and_plaquettes_generator(spec)
        # return _get_block(
        #     z_basis=kind.z,
        #     has_spatial_junction_in_timeslice=spec.has_spatial_up_or_down_pipe_in_timeslice,
        #     template=template,
        #     plaquettes_generator=pgen,
        #     repetitions=block_temporal_height,
        # )
